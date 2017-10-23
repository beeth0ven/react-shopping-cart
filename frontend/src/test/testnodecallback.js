const Rx = require('rx');

function signup(username, password, callback) {
  console.log('signup username:', username);
  console.log('signup password:', password);
  callback(null, 'data');
}

const rxSignup = Rx.Observable.fromNodeCallback(signup);

rxSignup('LuoJie', '123')
  .subscribe(
    data => console.log('success'),
    error => console.error(error)
  );

