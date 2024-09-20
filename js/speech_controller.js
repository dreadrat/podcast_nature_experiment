class SpeechController {
    constructor(basePath) {
        this.basePath = basePath;
        this.audio = new Audio();
        this.textContainer = null;
        this.wordIndex = 0;
    }

    playText(text, containerId) {
        this.textContainer = document.getElementById(containerId);
        const formattedText = text.trim().replace(/[^a-zA-Z0-9]/g, '_');
        const jsonFilePath = `${this.basePath}${formattedText}.json`;
        const audioFilePath = `${this.basePath}${formattedText}.mp3`;

        fetch(jsonFilePath)
            .then(response => response.json())
            .then(data => {
                const fullText = data.map(item => item.word).join(' ');
                this.textContainer.textContent = fullText;
                this.audio.src = audioFilePath;
                this.wordIndex = 0;

                this.audio.play();
                this.highlightText(data, this.wordIndex);

                this.audio.addEventListener('timeupdate', () => {
                    if (this.wordIndex < data.length && this.audio.currentTime >= data[this.wordIndex].timeSeconds) {
                        this.highlightText(data, this.wordIndex);
                        this.wordIndex++;
                    }
                });
            })
            .catch(error => console.error('Error loading JSON:', error));
    }

    highlightText(data, wordIndex) {
        const text = data.map((item, index) => {
            if (index === wordIndex) {
                return `<span class="highlight">${item.word}</span>`;
            } else {
                return item.word;
            }
        }).join(' ');
        this.textContainer.innerHTML = text;
    }
}
