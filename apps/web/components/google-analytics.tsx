import Script from "next/script";

/** GA4 property for sigil.kevinliu.studio. Measurement IDs are public; this one ships in page HTML. */
const GA_MEASUREMENT_ID = "G-MQJSNG2ZC7";

// Consent Mode v2 defaults are queued before gtag.js loads: no ad storage
// anywhere, and EEA/UK/CH visitors are measured without analytics cookies.
const GA_BOOTSTRAP = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied',region:['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','CH','GB']});
gtag('consent','default',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'granted'});
gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');`;

/**
 * GA4 on production deploys only; previews and local dev render nothing.
 * Client-side route changes are counted by GA4 enhanced measurement.
 */
export function GoogleAnalytics() {
  if (process.env.VERCEL_ENV !== "production") return null;

  return (
    <>
      <Script id="ga-bootstrap" strategy="afterInteractive">
        {GA_BOOTSTRAP}
      </Script>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
        strategy="afterInteractive"
      />
    </>
  );
}
