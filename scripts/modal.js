function _addEnvironmentLabel() {
  var language = document.getElementById("scLanguage");
  if (language) {
    var countryValue = language.getAttribute("value").substring(3).toUpperCase();
    var i = document.getElementById("chrome-languagemarker");
    if (i) {
      i.parentNode.removeChild(i);
    };
    const url = chrome.runtime.getURL('data.json');

    fetch(url)
    .then((response) => response.json()) 
    .then((json) =>{
        const countries = json.filter(d => d.code == countryValue);
        if(countries.length > 0){
          const country = countries[0];
          var wrapperDiv = document.createElement("div");
          wrapperDiv.id = "chrome-languagemarker";
          wrapperDiv.setAttribute(
            "style",
            "text-shadow: -1px -1px 0 #555, 1px -1px 0 #555, -1px 1px 0 #555, 1px 1px 0 #555; position: fixed; right: -127px; top: 43px; background-color:" +
            country.colour +
              '; opacity: 0.9; z-index: 100000; height: 55px; width: 396px; line-height: 55px; transform: rotate(44deg); box-shadow: 7px 0px 9px #000; text-align: center; font-size: 2em; color: #fff; font-family: "Open Sans", Arial, sans-serif;'
          );
          var flag = chrome.runtime.getURL("images/flags/4x3/" + country.code.toLowerCase() + ".svg");
          wrapperDiv.setAttribute(
            "style",
            wrapperDiv.getAttribute("style") +
              "background-image: url(" +
              flag +
              ");background-size: contain; background-position: 50%; background-repeat: no-repeat;"
          );
          wrapperDiv.innerText = country.name;
          document.body.appendChild(wrapperDiv);
        }
    });
  }
}
chrome.extension.onRequest.addListener(function(e, t, n) {
  if ("isDisabled" == e.action)
    n(
      document.getElementById("chrome-envmarker")
        ? document.getElementById("chrome-languagemarker")
          ? {
              isDisabled:
                "none" ==
                document.getElementById("chrome-languagemarker").style.display
            }
          : { isDisabled: "notSet" }
        : { isDisabled: "notSet" }
    );
  else if ("toggle" == e.action) {
    var r = document.getElementById("chrome-languagemarker");
    "none" == r.style.display
      ? (r.style.display = "block")
      : (r.style.display = "none");
  }
});
var MutationObserver = window.MutationObserver;
var elementObserver = new MutationObserver(function(e) {
  e.forEach(function(e) {
    "attributes" == e.type && _addEnvironmentLabel();
  });
});
var element = document.getElementById("scLanguage");
if(element){
  _addEnvironmentLabel();
  elementObserver.observe(element, { attributes: !0 });
}
