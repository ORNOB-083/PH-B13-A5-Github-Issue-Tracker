console.log('Dashboard page')

const toggleTab = (id) => {
    document.querySelectorAll("#btn-all, #btn-open, #btn-closed").forEach(btn => {
        btn.classList.remove("bg-blue-600", "text-white");
        btn.classList.add("bg-white", "text-black/60");
    });
    const btn = document.getElementById(id);
    btn.classList.remove("bg-white", "text-black/60");
    btn.classList.add("bg-blue-600", "text-white");
};