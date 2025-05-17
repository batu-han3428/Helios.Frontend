import parsePhoneNumber from 'libphonenumber-js';

export const countryNumber = (phoneNumber) => {
    try {
        const number = parsePhoneNumber(phoneNumber);
        const getCountryFlag = (<div>
            {number.country && (
                <>
                    <img
                        src={`https://flagcdn.com/16x12/${number.country.toLowerCase()}.png`}
                        alt={`${number.country} Flag`}
                        width="16"
                        height="12"
                    />
                    <span style={{ marginLeft: "5px" }}>{phoneNumber}</span>
                </>
            )}
        </div>);
        return getCountryFlag;
    } catch (error) {
        return "";
    }
};