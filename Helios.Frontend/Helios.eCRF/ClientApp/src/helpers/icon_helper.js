export const SdvIconStatu = (sdv) => {   
    if (sdv === 1) {
        return { icon: <i className="bi bi-check-circle-fill" style={{ color: '#3bbfad', cursor: 'pointer', fontSize: '20px' }}></i>, text: 'SDV done' };
    }
    else if (sdv === 2) {
        return { icon: <i className="bi bi-check-circle-fill" style={{ color: '#ffc600', cursor: 'pointer', fontSize: '20px' }}></i>, text: 'Partial SDV' };
    }
    else {
        return { icon: <i className="bi bi-check-circle-fill" style={{ color: '#ffa16c', cursor: 'pointer', fontSize: '20px' }}></i>, text: 'Ready for SDV' };
    }
}

export const QueryIconStatu = (query, cursor = false) => {
    if (query === 4) {
        return { icon: <i className="bi bi-exclamation-circle-fill" style={{ color: '#ffa16c', cursor: (cursor) ? 'pointer' : 'default', fontSize: '20px' }}></i>, text: 'Unanswered' };
    }
    else if (query === 5) {
        return { icon: <i className="bi bi-exclamation-circle-fill" style={{ color: '#ffc600', cursor: (cursor) ? 'pointer' : 'default', fontSize: '20px' }}></i>, text: 'Answered' };
    }
    else if (query === 6) {
        return { icon: <i className="bi bi-exclamation-circle-fill" style={{ color: '#bf9ec9', cursor: (cursor) ? 'pointer' : 'default', fontSize: '20px' }}></i>, text: 'Data change after query' };
    }
    else {
        return { icon: <i className="bi bi-exclamation-circle-fill" style={{ color: '#3bbfad', cursor: (cursor) ? 'pointer' : 'default', fontSize: '20px' }}></i>, text: 'Closed' };
    }
}