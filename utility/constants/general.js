const keys = {
    SERVICE: {
        name: 'Choose your service',
        type: 'DROPDOWN',
        value: 'Your service...',
    },
    CITY: {
        name: 'Choose your city',
        type: 'DROPDOWN',
        value: 'Your city...'
    },
    COMPANY: {
        name: 'Name of your company',
        type: 'TEXT',
        value: 'Your company...'
    },
    GST: {
        name: 'GST Number',
        type: 'TEXT',
        value: 'your gst number...'
    },
    COMPANY_REGISTERATION_NUMBER: {
        name: 'Company Registration Number',
        type: 'TEXT',
        value: 'your company registration number...'
    },
    ADHAAR: {
        name: 'Upload your Aadhaar card',
        type: 'FILE',
        value: 'your aadhaar number...'
    },
    PORTFOLIO_IMAGES: {
        name: 'Upload portfolio images',
        type: 'LIST',
        value: ''
    }
};

const kycPages = [{ SERVICE: keys.SERVICE, CITY: keys.CITY, COMPANY: keys.COMPANY, GST: keys.GST, COMPANY_REGISTERATION_NUMBER: keys.COMPANY_REGISTERATION_NUMBER, ADHAAR: keys.ADHAAR }, { PORTFOLIO_IMAGES: keys.PORTFOLIO_IMAGES }];

module.exports = {
    vendorHeaderKey: 'X-WEDLEY-VENDOR-ID',
    kycPages,
    pageCount: kycPages.length - 1
}