exports.member_type_enums = ["USER", "ADMIN", "PEDAL", "RESTAURANT"];
exports.member_status_enums = ["ONPAUSE", "ACTIVE", "DELETED"];
// deleted (soft delete, where the record is marked as deleted but not actually removed).
exports.ordinary_enums = ["Y", "N"];
// boolean equivalent, where "Y" stands for 'Yes' and "N" for 'No'.
exports.product_collection_enums = ["dish", "salad", "dessert", "drink", "etc"];
// Products can be categorized as a dish, salad, dessert, drink, or some other category ("etc").
exports.product_status_enums = ["PAUSED", "PROCESS", "DELETED"];
exports.product_size_enums = ["small", "normal", "large", "set"];
exports.product_volume_enums = [0.5, 1, 1.2, 1.5, 2];
// These enumerated values ensure consistency across the application and prevent invalid data from being entered. For example, when creating a new product, one might check that the provided size is one of the values in product_size_enums. If it's not, the application can reject the input or inform the user of the valid options.
