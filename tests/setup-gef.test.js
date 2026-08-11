import test from 'node:test';
import assert from 'node:assert';
import { applyTemplating } from '../generator/features/setup-gef.js';

test('applyTemplating should apply Standard strictness by default', () => {
  const content = "Lines: {{MAX_LINES}}, Params: {{MAX_PARAMS}}, Complexity: {{MAX_COMPLEXITY}}, Payload: {{MAX_PAYLOAD}}";
  const result = applyTemplating(content, 'Standard');
  
  assert.strictEqual(result, "Lines: 30, Params: 3, Complexity: 10, Payload: 1 Mo");
});

test('applyTemplating should apply Startup strictness', () => {
  const content = "Lines: {{MAX_LINES}}, Params: {{MAX_PARAMS}}, Complexity: {{MAX_COMPLEXITY}}, Payload: {{MAX_PAYLOAD}}";
  const result = applyTemplating(content, 'Startup / R&D (Assoupli)');
  
  assert.strictEqual(result, "Lines: 50, Params: 4, Complexity: 15, Payload: 5 Mo");
});

test('applyTemplating should apply Mission Critical strictness', () => {
  const content = "Lines: {{MAX_LINES}}, Params: {{MAX_PARAMS}}, Complexity: {{MAX_COMPLEXITY}}, Payload: {{MAX_PAYLOAD}}";
  const result = applyTemplating(content, 'Mission Critical (Sévérité Max)');
  
  assert.strictEqual(result, "Lines: 15, Params: 2, Complexity: 5, Payload: 100 Ko");
});
