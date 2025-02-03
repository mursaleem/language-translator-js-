import { clientTranslator } from './clientTranslator.js';

const agentui = function(){
    
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Sorry, your browser does not support the Web Speech API.");
      return;
    } 
    const agentRecognition = new SpeechRecognition();
    const callAgentRecognition = new SpeechRecognition();
    const synthSpeaker = window.speechSynthesis;

    const startAgentButton = document.getElementById("startAgentButton");
    const stopAgentButton = document.getElementById("stopAgentButton");
    const startCallAgentButton = document.getElementById("startCallAgentButton");
    const stopCallAgentAgentButton = document.getElementById("stopCallAgentAgentButton");
    const userAgentLanguage = document.getElementById("userAgentLanguage");
    const callAgentLanguage = document.getElementById("callAgentLanguage");
    const language = {sourceLang: userAgentLanguage.value, targetLang: callAgentLanguage.value};   
    userAgentLanguage.addEventListener("change", (event) => {
        language.sourceLang = event.target.value;
    });
    callAgentLanguage.addEventListener("change", (event) => {
        language.targetLang = event.target.value;
    });

    startAgentButton.addEventListener("click", () => {
        agentRecognition.lang = language.sourceLang ;
        agentRecognition.start();        
    });
    
    stopAgentButton.addEventListener("click", () => {
        agentRecognition.stop();        
    });

    startCallAgentButton.addEventListener("click", () => {
        callAgentRecognition.lang = language.targetLang ;
        callAgentRecognition.start();        
    });
    
    stopCallAgentAgentButton.addEventListener("click", () => {
        callAgentRecognition.stop();        
    });

    agentRecognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;    
        console.log("Agent heard: ", transcript);    
        let talk = {text: transcript, sourceLang: language.sourceLang, targetLang: language.targetLang};
        clientTranslator.agentSpeak(talk, (translatedText) => {
            console.log("Agent Translated Text: ", translatedText);  
            speakText(translatedText,talk.targetLang);   
        });
    };
    agentRecognition.onerror = (event) => {
        console.error("Agent Speech Recognition Error:", event.error);
    };

    callAgentRecognition.onresult = async (event) => {
        const transcript = event.results[0][0].transcript;    
        console.log("Call Center Agent heard: ", transcript);    
        let talk = {text: transcript, sourceLang: language.targetLang, targetLang: language.sourceLang};
        clientTranslator.agentSpeak(talk, (translatedText) => {
            console.log("Call Center Agent Translated Text: ", translatedText);  
            speakText(translatedText,talk.targetLang);   
        });
    };

    callAgentRecognition.onerror = (event) => {
        console.error("Call Center Agent Speech Recognition Error:", event.error);
    };


    function speakText(text,lang){
        while(synthSpeaker.speaking){
            console.log("waiting for speaker to finish...");
            new Promise(r => setTimeout(r, 200));
        }
        let utterance = new SpeechSynthesisUtterance(text);   
            utterance.lang = lang;
            utterance.pitch = 1;
            setTimeout(() => {
                synthSpeaker.speak(utterance); 
            }, 200);
    }
}();

export default agentui;