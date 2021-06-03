export const RegexUtilities = {
  Phone: (phone) => {
    // Another syntax is /pattern/flags syntax: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im.test(phone)
    return new RegExp("^[\\+][(]?[0-9]{3}[)]?[-\\s\\.]?[0-9]{3}[-\\s\\.]?[0-9]{4,6}$", "im").test(phone);
  },
  ToSlug: (str) => {
    str = str.replace(/^\s+|\s+$/g, ""); // trim
    str = str.toLowerCase();
  
    // remove accents, swap ñ for n, etc
    var from = "àáäâèéëêìíïîòóöôùúüûñçěščřžýúůďťň·/_,:;";
    var to   = "aaaaeeeeiiiioooouuuuncescrzyuudtn--_---";
  
    for (var i=0, l=from.length ; i<l ; i++)
    {
      str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
    }
  
    str = str.replace(".", "-") // replace a dot by a dash 
      .replace(/[^a-z0-9 _ -]/g, "") // remove invalid chars, just allow a->z, 0->9, underscore and dash
      .replace(/\s+/g, "-") // collapse whitespace and replace by a dash
      .replace(/-+/g, "-") // collapse dashes
      .replace( /\//g, ""); // collapse all forward-slashes
  
    return str;
  }
};
