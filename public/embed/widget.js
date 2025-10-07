(function(){
  const script = document.currentScript;
  const tenant = script?.dataset?.tenant || '';
  const key = script?.dataset?.key || '';
  const origin = window.location.origin; // when hosted on your domain

  function mount(){
    const iframe = document.createElement('iframe');
    iframe.src = origin + '/widget/embedded?tenant=' + encodeURIComponent(tenant);
    iframe.style.position='fixed';
    iframe.style.bottom='16px';
    iframe.style.right='16px';
    iframe.style.width='360px';
    iframe.style.height='560px';
    iframe.style.border='0';
    iframe.style.borderRadius='12px';
    iframe.style.boxShadow='0 10px 30px rgba(0,0,0,0.2)';
    iframe.allow = 'microphone; clipboard-read; clipboard-write';
    document.body.appendChild(iframe);
  }

  // For demo we skip token minting and mount immediately.
  // Replace by calling /api/embed/token with tenant+key, store token in cookie/header.
  if(tenant){ mount(); }
})();
