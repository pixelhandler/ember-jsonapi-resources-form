import { test } from 'qunit';
import moduleForAcceptance from '../../tests/helpers/module-for-acceptance';

moduleForAcceptance('Acceptance | resource-form');

test('visiting /resource-form', function(assert) {
  visit('/');

  andThen(function() {
    assert.equal(currentURL(), '/');
    assert.equal(find('form:first input:first').attr('disabled'), void 0, '1st input IS NOT disabled');
    assert.equal(find('form:first button').length, 1, '1 button in editng mode');
    assert.equal(find('form:last input:first').attr('disabled'), 'disabled', '1st input IS disabled');
    assert.equal(find('form:last button').length, 2, '2 buttons in previewing mode');
  });
});
