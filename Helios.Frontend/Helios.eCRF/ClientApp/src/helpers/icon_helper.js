export const IconStatu = (sdv) => {
    if (sdv === 1) {
        return <i class="bi bi-check-circle-fill" style={{ color: '#3bbfad' }}></i>;
    }
    else if (sdv === 2) {
        return <i class="bi bi-check-circle-fill" style={{ color: '#ffc600 ' }}></i>;
    }
    else {
        return <i class="bi bi-check-circle-fill" style={{ color: '#ffa16c' }}></i>;
    }

}