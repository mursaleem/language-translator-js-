const clientTranslator = function() {
    async function agentSpeak(talk,callbackSpeaker) {
        let translatedText = await translate(talk);
        callbackSpeaker(translatedText);
    }
    
    async function translate(talk){
        const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(talk.text)}&langpair=${talk.sourceLang}|${talk.targetLang}`);
        const data = await response.json();
        return data.responseData.translatedText;
    }

    return {
        agentSpeak: agentSpeak
    };
}();

export { clientTranslator };