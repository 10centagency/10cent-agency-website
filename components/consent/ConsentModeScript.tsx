import React from 'react';

interface ConsentModeScriptProps {
  nonce?: string;
}

/**
 * Injected in <head> to initialize dataLayer, define gtag(), and set Google Consent Mode v2
 * defaults as 'denied' for non-essential storage BEFORE any tag or analytics script executes.
 * If a valid choice is already saved in 'tc_consent_v1', it applies the saved preference.
 */
export default function ConsentModeScript({ nonce }: ConsentModeScriptProps) {
  const initCode = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = gtag;

(function() {
  var initialConsent = {
    ad_storage: 'denied',
    analytics_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    functionality_storage: 'granted',
    security_storage: 'granted'
  };

  try {
    var saved = localStorage.getItem('tc_consent_v1');
    if (saved) {
      var pref = JSON.parse(saved);
      if (pref && typeof pref === 'object') {
        if (pref.analytics) {
          initialConsent.analytics_storage = 'granted';
        }
        if (pref.marketing) {
          initialConsent.ad_storage = 'granted';
          initialConsent.ad_user_data = 'granted';
          initialConsent.ad_personalization = 'granted';
        }
      }
    }
  } catch (err) {}

  gtag('consent', 'default', initialConsent);
})();
  `.trim();

  return (
    <script
      id="tc-consent-mode-init"
      nonce={nonce}
      dangerouslySetInnerHTML={{ __html: initCode }}
    />
  );
}
