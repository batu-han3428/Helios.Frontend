import i18n from 'i18next';

export const SdvIconStatu = (sdv) => {   
    if (sdv === 1) {
        return <i className="bi bi-check-circle-fill" style={{ color: '#3bbfad' }} title={i18n.t("SDV done")}></i>;
    }
    else if (sdv === 2) {
        return <i className="bi bi-check-circle-fill" style={{ color: '#ffc600' }} title={i18n.t("Partial SDV")}></i>;
    }
    else {
        return <i className="bi bi-check-circle-fill" style={{ color: '#ffa16c' }} title={i18n.t("Ready for SDV")}></i>;
    }

}
export const QueryIconStatu = (query) => {
    if (query === 1) {
        return <i className="bi bi-exclamation-circle-fill" style={{ color: ' #ffa16c ' }} title={i18n.t("Unanswered")}></i>
    }
    else if (query === 2) {
        return <i className="bi bi-exclamation-circle-fill" style={{ color: '#ffc600' }} title={i18n.t("Answered")}></i>
    }
    else if (query === 3) {
        return <i className="bi bi-exclamation-circle-fill" style={{ color: '#bf9ec9' }} title={i18n.t("Data change after query")}></i>
    }
    else {
        return <i className="bi bi-exclamation-circle-fill" style={{ color: '#3bbfad' }} title={i18n.t("Closed")}></i>
    }

}