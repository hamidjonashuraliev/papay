class Definer {
    /** member auth related: class named Definer which consists of static properties. */
    static auth_err1 = "att: mongodb validation failed";
    static err_auth3 = "att: no member with that mb_nick";
    static err_auth4 = "att: your credentials do not match";
}
// they belong to the class itself rather than instances of the class. We can access them directly via the class name without creating an instance of the class.
// The structure is useful for maintaining organized and centralized error messages

module.exports = Definer;
