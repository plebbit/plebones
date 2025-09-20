export default {
  'text-math': {
    optionInputs: [{option: 'difficulty', label: 'Difficulty', default: '1', description: 'The math difficulty of the challenge between 1-3.', placeholder: '1'}],
    type: 'text/plain',
    description: 'Ask a plain text math question, insecure, use ONLY for testing.',
  },
  'captcha-canvas-v3': {
    optionInputs: [
      {option: 'characters', label: 'Characters', description: 'Amount of characters of the captcha.', default: '6', placeholder: 'example: 6'},
      {option: 'height', label: 'Height', description: 'Height of the captcha in pixels.', default: '100', placeholder: 'example: 100'},
      {option: 'width', label: 'Width', description: 'Width of the captcha in pixels.', default: '300', placeholder: 'example: 300'},
      {
        option: 'colors',
        label: 'Colors',
        description: 'Colors of the captcha text as hex comma separated values.',
        default: '#32cf7e',
        placeholder: 'example: #ff0000,#00ff00,#0000ff',
      },
    ],
    type: 'image/png',
    description: 'make custom image captcha',
    caseInsensitive: true,
  },
  fail: {
    optionInputs: [
      {
        option: 'error',
        label: 'Error',
        default: "You're not allowed to publish.",
        description: 'The error to display to the author.',
        placeholder: "You're not allowed to publish.",
      },
    ],
    type: 'text/plain',
    description: 'A challenge that automatically fails with a custom error message.',
  },
  blacklist: {
    optionInputs: [
      {
        option: 'addresses',
        label: 'Addresses',
        default: '',
        description: 'Comma separated list of author addresses to be blacklisted.',
        placeholder: 'address1.eth,address2.eth,address3.eth',
      },
      {
        option: 'urls',
        label: 'URLs',
        default: '',
        description: 'Comma separated list of URLs to fetch blacklists from (JSON arrays of addresses)',
        placeholder: 'https://example.com/file.json,https://github.com/blacklist.json',
      },
      {option: 'error', label: 'Error', default: "You're blacklisted.", description: 'The error to display to the author.', placeholder: "You're blacklisted."},
    ],
    type: 'text/plain',
    description: 'Blacklist author addresses.',
  },
  whitelist: {
    optionInputs: [
      {
        option: 'addresses',
        label: 'Addresses',
        default: '',
        description: 'Comma separated list of author addresses to be whitelisted.',
        placeholder: 'address1.eth,address2.eth,address3.eth',
      },
      {
        option: 'urls',
        label: 'URLs',
        default: '',
        description: 'Comma separated list of URLs to fetch whitelists from (JSON arrays of addresses)',
        placeholder: 'https://example.com/file.json,https://github.com/whitelist.json',
      },
      {option: 'error', label: 'Error', default: "You're not whitelisted.", description: 'The error to display to the author.', placeholder: "You're not whitelisted."},
    ],
    type: 'text/plain',
    description: 'Whitelist author addresses.',
  },
  question: {
    optionInputs: [
      {option: 'question', label: 'Question', default: '', description: 'The question to answer.', placeholder: ''},
      {option: 'answer', label: 'Answer', default: '', description: 'The answer to the question.', placeholder: '', required: true},
    ],
    type: 'text/plain',
    description: "Ask a question, like 'What is the password?'",
  },
  'evm-contract-call': {
    optionInputs: [
      {option: 'chainTicker', label: 'chainTicker', default: 'eth', description: 'The chain ticker', placeholder: 'eth', required: true},
      {option: 'address', label: 'Address', default: '', description: 'The contract address.', placeholder: '0x...', required: true},
      {
        option: 'abi',
        label: 'ABI',
        default: '',
        description: 'The ABI of the contract method.',
        placeholder: '{"constant":true,"inputs":[{"internalType":"address","name":"account...',
        required: true,
      },
      {option: 'condition', label: 'Condition', default: '', description: 'The condition the contract call response must pass.', placeholder: '>1000', required: true},
      {option: 'error', label: 'Error', default: "Contract call response doesn't pass condition.", description: 'The error to display to the author.'},
    ],
    type: 'chain/eth',
    description: 'The response from an EVM contract call passes a condition, e.g. a token balance challenge.',
  },
  'publication-match': {
    optionInputs: [
      {
        option: 'matches',
        label: 'Matches',
        default: '[]',
        description: 'JSON array of property name and regex pattern pairs to match against the publication.',
        placeholder: '[{"propertyName":"author.address","regexp":"\\.eth$"},{"propertyName":"content","regexp":"badword1|badword2|badword3"}]',
      },
      {
        option: 'error',
        label: 'Error',
        default: 'Publication does not match required patterns.',
        description: 'The error to display to the author when a match fails.',
        placeholder: 'Publication does not match required patterns.',
      },
      {
        option: 'matchAll',
        label: 'Match All',
        default: 'true',
        description: 'If true, all patterns must match. If false, at least one pattern must match.',
        placeholder: 'true',
      },
      {
        option: 'description',
        label: 'Description',
        default: 'Match publication properties against regex patterns.',
        description: 'Custom description for the challenge that explains what patterns are being matched.',
        placeholder: 'Authors must have .eth addresses',
      },
    ],
    type: 'text/plain',
    description: 'Match publication properties against regex patterns.',
  },
}
