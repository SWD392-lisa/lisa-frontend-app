import React from 'react';
import { Gift } from 'lucide-react';
import './GiftEffect.css';

export function GiftEffect({ event }) {
  if (!event) return null;
  return <div className="gift-effect" role="status" aria-live="polite">
    <div className="gift-effect__burst">
      {event.gift?.iconUrl ? <img src={event.gift.iconUrl} alt="" /> : <Gift size={38} />}
    </div>
    <div><strong>{event.sender?.displayName || 'Một học viên'}</strong><span>đã tặng {event.quantity || 1}× {event.gift?.name || 'quà'} cho {event.recipient?.displayName || 'Mentor'}</span></div>
  </div>;
}
