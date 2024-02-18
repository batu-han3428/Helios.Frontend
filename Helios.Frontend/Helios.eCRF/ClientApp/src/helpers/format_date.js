export const formatDate = (dateString) => {
    if (dateString === "0001-01-01T00:00:00+00:00") {
        return "-";
    }

    const options = { year: 'numeric', month: 'numeric', day: 'numeric' };
    const formattedDate = new Date(dateString).toLocaleDateString(undefined, options);
    return formattedDate;
}