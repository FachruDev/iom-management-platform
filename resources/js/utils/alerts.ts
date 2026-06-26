type ConfirmActionOptions = {
    title: string;
    text?: string;
    confirmButtonText?: string;
};

async function loadSwal() {
    const { default: Swal } = await import('sweetalert2');

    return Swal;
}

export async function confirmAction({
    title,
    text,
    confirmButtonText = 'Ya, lanjutkan',
}: ConfirmActionOptions): Promise<boolean> {
    const Swal = await loadSwal();
    const result = await Swal.fire({
        title,
        text,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText,
        cancelButtonText: 'Batal',
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#64748b',
        reverseButtons: true,
        focusCancel: true,
    });

    return result.isConfirmed;
}

export function showSuccessToast(message: string): void {
    void loadSwal().then((Swal) => Swal.fire({
        toast: true,
        position: 'top-end',
        icon: 'success',
        title: message,
        showConfirmButton: false,
        timer: 2600,
        timerProgressBar: true,
    }));
}

export function showErrorAlert(message: string): void {
    void loadSwal().then((Swal) => Swal.fire({
        icon: 'error',
        title: 'Terjadi kesalahan',
        text: message,
        confirmButtonColor: '#0A57A4',
    }));
}
