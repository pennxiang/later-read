function createFloatingButton() {
    const button = document.createElement("button");

    Object.assign(button.style, {
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: "99999",
        padding: "8px 12px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        opacity: "0.8",
    });

    button.addEventListener("mouseenter", () => button.style.opacity = "1");
    button.addEventListener("mouseleave", () => button.style.opacity = "0.8");

    // 检查当前页面是否已添加
    chrome.runtime.sendMessage({ type: "CHECK_CURRENT_PAGE" }, (response) => {
        let isSaved = response?.saved;
        updateButtonText();

        button.onclick = () => {
            if (isSaved) {
                chrome.runtime.sendMessage({ type: "REMOVE_CURRENT_PAGE" });
                isSaved = false;
            } else {
                chrome.runtime.sendMessage({ type: "SAVE_CURRENT_PAGE" });
                isSaved = true;
            }
            updateButtonText();
        };

        function updateButtonText() {
            button.innerText = isSaved ? "✅ 已添加" : "📌 稍后再看";
        }

        document.body.appendChild(button);
    });
}

createFloatingButton();
