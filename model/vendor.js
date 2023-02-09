const allColumns = {
    ID: {
        name: 'id',
        type: 'text'
    },
    SECRET: {
        name: 'secret',
        type: 'text'
    },
    PHONE_NUMBER: {
        name: 'phoneNumber',
        type: 'bigint'
    },
    NAME: {
        name: 'name',
        type: 'text'
    },
    CATEGORY: {
        name: 'category',
        type: 'text'
    },
    CITY: {
        name: 'city',
        type: 'text'
    },
    PROFILE_IMAGE_URL: {
        name: 'profileImageUrl',
        type: 'text'
    }
}

const mandatoryColumns = [
    allColumns.ID.name,
    allColumns.SECRET.name,
    allColumns.PHONE_NUMBER.name,
    allColumns.NAME.name,
    allColumns.CATEGORY.name,
    allColumns.CITY.name,
]

const vendorProfileColumns = [
    allColumns.NAME.name,
    allColumns.PHONE_NUMBER.name,
    allColumns.CATEGORY.name,
    allColumns.PROFILE_IMAGE_URL.name,
    allColumns.CITY.name

]

const authColumns = [
    allColumns.ID.name,
    allColumns.SECRET.name,
]

module.exports = {
    allColumns, mandatoryColumns, authColumns, vendorProfileColumns
}