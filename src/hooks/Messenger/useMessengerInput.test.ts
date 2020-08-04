import { prepareNewDMs } from './prepareNewDMs';
import { test_cases } from './useMessengerInput.test_cases'

test_cases.forEach(test_case => {
   test(test_case.it || 'should work', () => {
      const result = prepareNewDMs(test_case.cached, test_case.input);
      console.log("YOUR RESULT", JSON.stringify(result));
      expect(result).toStrictEqual(test_case.output);
   });
})