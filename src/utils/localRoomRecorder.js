const WIDTH = 1280;
const HEIGHT = 720;
const FRAME_RATE = 8;
const CHUNK_INTERVAL_MS = 2000;

const supportedMimeType = () => [
  'video/webm;codecs=vp8,opus',
  'video/webm;codecs=vp9,opus',
  'video/webm',
  'video/mp4',
].find((type) => window.MediaRecorder?.isTypeSupported(type));

const initials = (name) => String(name || 'Anonymous')
  .trim()
  .split(/\s+/)
  .slice(0, 2)
  .map((part) => part[0]?.toUpperCase() || '')
  .join('') || 'A';

const avatarColor = (value) => {
  let hash = 0;
  for (const char of String(value || 'anonymous')) hash = ((hash << 5) - hash) + char.charCodeAt(0);
  const colors = ['#0b6655', '#9b6b20', '#315b7d', '#704f82', '#9a4c43', '#3f6f43'];
  return colors[Math.abs(hash) % colors.length];
};

const roundedRect = (context, x, y, width, height, radius) => {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
  context.fill();
};

export class LocalRoomRecorder {
  constructor({ recordingId, sessionTitle, getParticipants, uploadChunk }) {
    this.recordingId = recordingId;
    this.sessionTitle = sessionTitle || 'LUCY Learning Room';
    this.getParticipants = getParticipants;
    this.uploadChunk = uploadChunk;
    this.audioContext = null;
    this.audioDestination = null;
    this.canvas = null;
    this.context = null;
    this.mediaRecorder = null;
    this.renderTimer = null;
    this.startedAt = 0;
    this.sequence = 0;
    this.uploadChain = Promise.resolve();
    this.uploadError = null;
    this.connectedTracks = new WeakSet();
    this.audioSources = [];
    this.logoImage = null;
  }

  async start(initialAudioTracks = []) {
    if (!window.MediaRecorder) throw new Error('Trình duyệt này không hỗ trợ MediaRecorder.');
    const mimeType = supportedMimeType();
    if (!mimeType) throw new Error('Trình duyệt không hỗ trợ định dạng video WebM/MP4.');

    await this.prepareAudio(initialAudioTracks);

    this.canvas = document.createElement('canvas');
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.context = this.canvas.getContext('2d', { alpha: false });
    this.logoImage = await this.loadImage('/lucy3.png').catch(() => null);
    this.startedAt = Date.now();
    this.drawFrame();
    this.renderTimer = window.setInterval(() => this.drawFrame(), 1000 / FRAME_RATE);

    const canvasStream = this.canvas.captureStream(FRAME_RATE);
    const stream = new MediaStream([
      ...canvasStream.getVideoTracks(),
      ...this.audioDestination.stream.getAudioTracks(),
    ]);
    this.mediaRecorder = new MediaRecorder(stream, {
      mimeType,
      videoBitsPerSecond: 900_000,
      audioBitsPerSecond: 96_000,
    });
    this.mediaRecorder.addEventListener('dataavailable', (event) => {
      if (!event.data?.size) return;
      const sequence = this.sequence++;
      this.uploadChain = this.uploadChain.then(async () => {
        if (this.uploadError) return;
        try {
          await this.uploadChunk(this.recordingId, sequence, mimeType, event.data);
        } catch (error) {
          this.uploadError = error;
        }
      });
    });
    this.mediaRecorder.start(CHUNK_INTERVAL_MS);
    return { mimeType };
  }

  async prepareAudio(initialAudioTracks = []) {
    if (!this.audioContext) {
      this.audioContext = new AudioContext();
      this.audioDestination = this.audioContext.createMediaStreamDestination();
    }
    await this.audioContext.resume();
    initialAudioTracks.filter(Boolean).forEach((track) => this.addAudioTrack(track));
  }

  setRecordingId(recordingId) {
    this.recordingId = recordingId;
  }

  addAudioTrack(agoraTrack) {
    if (!this.audioContext || !this.audioDestination || !agoraTrack || this.connectedTracks.has(agoraTrack)) return;
    const nativeTrack = agoraTrack.getMediaStreamTrack?.();
    if (!nativeTrack) return;
    const source = this.audioContext.createMediaStreamSource(new MediaStream([nativeTrack]));
    source.connect(this.audioDestination);
    this.connectedTracks.add(agoraTrack);
    this.audioSources.push(source);
  }

  async stop() {
    if (!this.mediaRecorder) throw new Error('Local recorder is not running.');
    if (this.mediaRecorder.state !== 'inactive') {
      await new Promise((resolve) => {
        this.mediaRecorder.addEventListener('stop', resolve, { once: true });
        this.mediaRecorder.stop();
      });
    }
    await this.uploadChain;
    if (this.uploadError) throw this.uploadError;
    const durationSeconds = Math.max(1, Math.round((Date.now() - this.startedAt) / 1000));
    await this.dispose();
    return { durationSeconds, chunkCount: this.sequence };
  }

  async dispose() {
    if (this.renderTimer) window.clearInterval(this.renderTimer);
    this.renderTimer = null;
    this.mediaRecorder?.stream?.getTracks().forEach((track) => track.stop());
    this.audioSources.forEach((source) => source.disconnect());
    this.audioSources = [];
    await this.audioContext?.close().catch(() => undefined);
    this.audioContext = null;
    this.audioDestination = null;
    this.mediaRecorder = null;
  }

  drawFrame() {
    const context = this.context;
    if (!context) return;
    const participants = [...(this.getParticipants?.() || [])];
    context.fillStyle = '#062f2a';
    context.fillRect(0, 0, WIDTH, HEIGHT);

    const gradient = context.createLinearGradient(0, 0, WIDTH, HEIGHT);
    gradient.addColorStop(0, 'rgba(13, 87, 75, .96)');
    gradient.addColorStop(1, 'rgba(3, 36, 33, .98)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, WIDTH, HEIGHT);

    if (this.logoImage) {
      context.globalAlpha = 0.12;
      context.drawImage(this.logoImage, WIDTH - 350, -40, 360, 230);
      context.globalAlpha = 1;
    }

    context.fillStyle = '#f8f3e7';
    context.font = '700 28px Arial, sans-serif';
    context.fillText('LUCY · SPEAK FREELY', 48, 52);
    context.font = '500 18px Arial, sans-serif';
    context.fillStyle = 'rgba(248, 243, 231, .76)';
    context.fillText(this.sessionTitle, 48, 82);

    const elapsed = Math.max(0, Math.floor((Date.now() - this.startedAt) / 1000));
    const elapsedText = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
    context.fillStyle = '#ef554a';
    context.beginPath();
    context.arc(WIDTH - 145, 54, 7, 0, Math.PI * 2);
    context.fill();
    context.font = '700 18px Arial, sans-serif';
    context.fillStyle = '#ffffff';
    context.fillText(`REC ${elapsedText}`, WIDTH - 125, 61);

    const visible = participants.slice(0, 12);
    const count = Math.max(visible.length, 1);
    const columns = count <= 2 ? count : count <= 6 ? 3 : 4;
    const rows = Math.ceil(count / columns);
    const gap = 16;
    const areaX = 48;
    const areaY = 112;
    const areaWidth = WIDTH - 96;
    const areaHeight = HEIGHT - 156;
    const tileWidth = (areaWidth - gap * (columns - 1)) / columns;
    const tileHeight = (areaHeight - gap * (rows - 1)) / rows;

    if (visible.length === 0) {
      this.drawParticipantTile({ displayName: 'Waiting for participants', role: 'ROOM', speaking: false }, areaX, areaY, tileWidth, tileHeight);
    } else {
      visible.forEach((participant, index) => {
        const column = index % columns;
        const row = Math.floor(index / columns);
        this.drawParticipantTile(
          participant,
          areaX + column * (tileWidth + gap),
          areaY + row * (tileHeight + gap),
          tileWidth,
          tileHeight,
        );
      });
    }
  }

  drawParticipantTile(participant, x, y, width, height) {
    const context = this.context;
    const speaking = Boolean(participant.speaking);
    context.fillStyle = speaking ? '#174f43' : 'rgba(4, 29, 27, .82)';
    roundedRect(context, x, y, width, height, 18);
    context.strokeStyle = speaking ? '#e4ba58' : 'rgba(248, 243, 231, .13)';
    context.lineWidth = speaking ? 5 : 1;
    context.strokeRect(x + 2, y + 2, width - 4, height - 4);

    const radius = Math.min(width, height) * 0.2;
    const centerX = x + width / 2;
    const centerY = y + height / 2 - 14;
    context.fillStyle = avatarColor(participant.anonymousUserId || participant.displayName);
    context.beginPath();
    context.arc(centerX, centerY, radius, 0, Math.PI * 2);
    context.fill();
    context.fillStyle = '#ffffff';
    context.font = `700 ${Math.max(24, Math.floor(radius * 0.7))}px Arial, sans-serif`;
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(initials(participant.displayName), centerX, centerY + 2);

    context.font = `700 ${Math.max(17, Math.min(23, Math.floor(width / 13)))}px Arial, sans-serif`;
    context.fillText(String(participant.displayName || 'Anonymous').slice(0, 28), centerX, y + height - 42);
    context.font = '600 13px Arial, sans-serif';
    context.fillStyle = speaking ? '#f2ce77' : 'rgba(248, 243, 231, .62)';
    context.fillText(speaking ? '● SPEAKING' : `${participant.role || 'PARTICIPANT'} · ${participant.micEnabled ? 'MIC ON' : 'MIC OFF'}`, centerX, y + height - 18);
    context.textAlign = 'start';
    context.textBaseline = 'alphabetic';
  }

  loadImage(src) {
    return new Promise((resolve, reject) => {
      const image = new Image();
      image.onload = () => resolve(image);
      image.onerror = reject;
      image.src = src;
    });
  }
}
