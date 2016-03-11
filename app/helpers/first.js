import Ember from 'ember';

export function first([list]/*, hash*/) {
  return list[0];
}

export default Ember.Helper.helper(first);
