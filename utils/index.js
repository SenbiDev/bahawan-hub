const { Ability, AbilityBuilder } = require('@casl/ability');

function getToken(req) {
  const token = req.headers.authorization
    ? req.headers.authorization.replace('Bearer ', '')
    : null;

  return token && token.length ? token : null;
}

const policies = {
  guest() {},
  user(user, { can }) {
    can('read', 'Ticket', { user_id: user._id });
    can('create', 'Ticket', { user_id: user._id });
  },
  admin(user, { can }) {
    can('manage', 'all');
  },
};

const policyFor = (user) => {
  const builder = new AbilityBuilder();
  if (user && typeof policies[user.role] === 'function') {
    policies[user.role](user, builder);
  } else {
    policies.guest(user, builder);
  }

  return new Ability(builder.rules);
};

module.exports = {
  getToken,
  policyFor,
};
