const isEmpty = (string) => {
  if (string.trim() === "") return true;
  else return false;
};

const isEmailValid = (email) => {
  const regEx = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (email.match(regEx)) return true;
  else return false;
};

exports.validateSignUpData = (data) => {
  //Validate data
  let errors = {};
  console.log(data);
  //email
  if (isEmpty(data.email)) {
    errors.email = "Senin gibi boş olamaz!";
  } else if (!isEmailValid(data.email)) {
    errors.email = "Emailini düzgün yazar mısın kardeşim!";
  }
  //pass
  if (isEmpty(data.password)) {
    errors.password = "Senin gibi boş olamaz!";
  }
  //confirmpass
  if (data.password !== data.confirmPassword) {
    errors.confirmPassword = "Şifreler uyuşmuyor!";
  }
  //handle
  if (isEmpty(data.handle)) {
    errors.handle = "Senin gibi boş olamaz!";
  } else if (data.handle.length > 20) {
    errors.handle = "20 karakterden uzun olamaz!";
  } else if (/\s/.test(data.handle)) {
    errors.handle = "Handle boşluk içeremez!";
  }

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.validateLoginData = (data) => {
  let errors = {};

  if (isEmpty(data.email)) errors.email = "Senin gibi boş olamaz!";
  if (isEmpty(data.password)) errors.password = "Senin gibi boş olamaz!";

  return {
    errors,
    valid: Object.keys(errors).length === 0 ? true : false,
  };
};

exports.reduceUserDetail = (data) => {
  let userDetails = {};
  if (!isEmpty(data.bio.trim()) && data.bio.length < 200) userDetails.bio = data.bio;
  if (!isEmpty(data.nickname.trim()) && data.nickname.length < 20) {
    data.nickname = data.nickname.substring(0, 20);
    userDetails.nickname = data.nickname;
  }

  if (!isEmpty(data.website.trim())) {
    //https://
    if (data.website.trim().substring(0, 4) !== "http") {
      userDetails.website = `http://${data.website.trim()}`;
    } else userDetails.website = data.website;
  }

  return userDetails;
};
