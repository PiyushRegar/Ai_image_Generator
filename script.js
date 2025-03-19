const generateForm = document.querySelector(".generate-form");
const generateBtn = generateForm.querySelector(".generate-btn");
const imageGallery = document.querySelector(".image-gallery");

let isImageGenerating = false;

const updateImageCard = (imgDataArray) => {
    imageGallery.innerHTML = ""; 
    imgDataArray.forEach((imgObject) => {
        const imgCard = document.createElement("div");
        imgCard.classList.add("img-card");

        const imgElement = document.createElement("img");
        imgElement.src = imgObject.src; 
        imgElement.alt = "AI Generated Image";

        const downloadBtn = document.createElement("a");
        downloadBtn.classList.add("download-btn");
        downloadBtn.href = imgObject.src;
        downloadBtn.download = `AI-Image-${Date.now()}.jpg`;
        downloadBtn.innerHTML = '<img src="images/download.svg" alt="Download Icon">';

        imgCard.appendChild(imgElement);
        imgCard.appendChild(downloadBtn);
        imageGallery.appendChild(imgCard);
    });
}

const generateAiImages = async (userPrompt, userImgQuantity) => {
    try {
        const response = await fetch("https://api.viro.ai/v1/generate_image", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "ee83557339b7c363f0e27fad8e50acf0581c6b70136407d5d79e6971cd9e8af4", 
            },
            body: JSON.stringify({
                prompt: userPrompt,
                num_images: userImgQuantity,  
                size: "512x512", 
            }),
        });

        if (!response.ok) throw new Error("Failed to fetch AI images from Viro.ai.");

        const data = await response.json();
        if (!data.images || data.images.length === 0) throw new Error("No images found. Try a different prompt.");

        // Sirf selected quantity ke images dikhane hain
        updateImageCard(data.images.slice(0, userImgQuantity));
    } catch (error) {
        alert(error.message);
    } finally {
        generateBtn.removeAttribute("disabled");
        generateBtn.innerText = "Generate";
        isImageGenerating = false;
    }
}

const handleImageGeneration = (e) => {
    e.preventDefault();
    if (isImageGenerating) return;

    const userPrompt = e.target.querySelector(".prompt-input").value;
    const userImgQuantity = parseInt(e.target.querySelector(".img-quantity").value);

    generateBtn.setAttribute("disabled", true);
    generateBtn.innerText = "Generating...";
    isImageGenerating = true;

    generateAiImages(userPrompt, userImgQuantity);
}

generateForm.addEventListener("submit", handleImageGeneration);
