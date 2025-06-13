import { useState, useEffect, useRef } from "react";

export default function Main() {
    const [meme, setMeme] = useState({
        topText: "One does not simply",
        bottomText: "Walk into Mordor",
        imageUrl: "http://i.imgflip.com/1bij.jpg"
    });
    const [allMemes, setAllMemes] = useState([]);
    const canvasRef = useRef(null);

    useEffect(() => {
        fetch("https://api.imgflip.com/get_memes")
            .then(res => res.json())
            .then(data => setAllMemes(data.data.memes));
    }, []);

    function getMemeImage() {
        const randomNumber = Math.floor(Math.random() * allMemes.length);
        const newMemeUrl = allMemes[randomNumber].url;
        setMeme(prevMeme => ({
            ...prevMeme,
            imageUrl: newMemeUrl
        }));
    }

    function handleChange(event) {
        const { value, name } = event.currentTarget;
        setMeme(prevMeme => ({
            ...prevMeme,
            [name]: value
        }));
    }

    function downloadMeme() {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");
        const image = new Image();
        image.crossOrigin = "anonymous";
        image.src = meme.imageUrl;

        image.onload = () => {
            // Set canvas size to match image
            canvas.width = image.width;
            canvas.height = image.height;

            // Draw image
            ctx.drawImage(image, 0, 0);

            // Text styling
            ctx.font = `${canvas.width / 10}px Impact`;
            ctx.fillStyle = "white";
            ctx.strokeStyle = "black";
            ctx.lineWidth = 2;
            ctx.textAlign = "center";

            // Draw top text
            ctx.fillText(meme.topText.toUpperCase(), canvas.width / 2, canvas.height * 0.3);
            ctx.strokeText(meme.topText.toUpperCase(), canvas.width / 2, canvas.height * 0.3);

            // Draw bottom text
            ctx.fillText(meme.bottomText.toUpperCase(), canvas.width / 2, canvas.height * 0.95);
            ctx.strokeText(meme.bottomText.toUpperCase(), canvas.width / 2, canvas.height * 0.95);

            // Download
            const link = document.createElement("a");
            link.download = "meme.png";
            link.href = canvas.toDataURL("image/png");
            link.click();
        };
    }

    return (
        <main>
            <div className="form">
                <label>Top Text
                    <input
                        type="text"
                        placeholder="One does not simply"
                        name="topText"
                        onChange={handleChange}
                        value={meme.topText}
                    />
                </label>

                <label>Bottom Text
                    <input
                        type="text"
                        placeholder="Walk into Mordor"
                        name="bottomText"
                        onChange={handleChange}
                        value={meme.bottomText}
                    />
                </label>
                <button onClick={getMemeImage}>Get a new meme image 🖼</button>
            </div>

            <div className="meme">
                <img src={meme.imageUrl} alt="Generated Meme" width="400" />
                <span className="top">{meme.topText}</span>
                <span className="bottom">{meme.bottomText}</span>
                <br />
                <button className="Download-btn" onClick={downloadMeme}>Download Meme</button>
            </div>

            {/* Hidden canvas for rendering the downloadable image */}
            <canvas ref={canvasRef} style={{ display: "none" }}></canvas>
        </main>
    );
}
