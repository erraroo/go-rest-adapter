import { moduleForModel, test } from 'ember-qunit';

moduleForModel('go-rest', 'Unit | Serializer | go rest', {
  // Specify the other units that are required for this test.
  needs: ['serializer:go-rest']
});

// Replace this with your real tests.
test('it serializes records', function(assert) {
  var record = this.subject();

  var serializedRecord = record.serialize();

  assert.ok(serializedRecord);
});
