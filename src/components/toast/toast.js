
export function showToast(message, isSuccess) {

    if (!document.querySelector('.toast-container')) {
        const toastContainer = document.createElement('div');
        toastContainer.className = 'toast-container position-fixed top-0 end-0 p-3';
        toastContainer.style.zIndex = '1050';
        document.body.appendChild(toastContainer);
    }

    const toastEl = document.createElement('div');
    toastEl.className = 'toast align-items-center text-bg-danger border-0';
    toastEl.role = 'alert';
    toastEl.ariaLive = 'assertive';
    toastEl.ariaAtomic = 'true';

    if (isSuccess) {
        toastEl.classList.add('bg-success');
    } else {
        toastEl.classList.add('bg-danger');
    }

    toastEl.innerHTML = `
    <div class="d-flex">
        <div class="toast-body">
            ${message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
    </div>
  `;

    document.querySelector('.toast-container').appendChild(toastEl);
    // Mostrar el toast
    const toast = new bootstrap.Toast(toastEl);
    toast.show();
    // Eliminar el toast del DOM cuando se oculta
    toastEl.addEventListener('hidden.bs.toast', () => {
        toastEl.remove();
    });

}
