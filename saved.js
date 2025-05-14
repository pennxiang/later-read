document.addEventListener('DOMContentLoaded', () => {
    const list = document.getElementById('linkList');
    chrome.storage.local.get({ links: [] }, (result) => {
        list.innerHTML = '';
        result.links.forEach((item, idx) => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.url}" target="_blank">${item.title}</a>
                      <button data-index="${idx}">❌</button>`;
            list.appendChild(li);
        });

        list.querySelectorAll('button').forEach(btn => {
            btn.addEventListener('click', () => {
                const idx = btn.getAttribute('data-index');
                result.links.splice(idx, 1);
                chrome.storage.local.set({ links: result.links }, () => location.reload());
            });
        });
    });
});
