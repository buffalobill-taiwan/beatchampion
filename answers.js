// The code gives the color and word lengths, including punctuation in each word.
// The first SHA-256 hash identifies the answer in saved progress.
const answers = [
  {
    code: 'W4_2_3_5',
    hashes: [
      '5bda42eda27563b0d6893bc4e22981351f0684b36f1450826eba23acb313c078',
      'aaa6eb30e1b105dcf4bd2d25ec42db3f6597693c9abb29c9c4bbaaa04ac947f4',
      'fbc9e2267ac1ad6506f271ca863306849ff73d978e5a4e7da7c7c76ef1a77ca1',
    ],
  },
  {
    code: 'W6_2_10',
    hashes: [
      '359af4c68f7c8566843123986bba66acb1339327cb1df30d4fe77048e42fa4f9',
      '8367f978b23c0cb55b7e2896e5138075c00be08e7bb2405d15e745184f8fbb06',
      '0d30fc1a0a3251092509525b8da4db69410c4f45a9a4c4c1ebf0688778b7c729',
    ],
  },
  {
    code: 'W6_2_3_8',
    hashes: [
      'd73e0751b549b3c380db43c1865ecc8b101744bdedb480e55e0899fcff89df93',
      'fed39e7482347046de42d6aa11900d1766cdf82c20948fe9e1d65ea7cc82741e',
    ],
  },
  {
    code: 'W6_5',
    hashes: [
      'bb5343c06955118bcdae9109f2b7d8a45a9b305c1ae85925132d93432c9528a8',
      '93e88571253e9704423705b6aefbfa897cdf74234dfe31170f98fb8052b883bd',
      'e6ed70cc6b5da268b440e04967a9183523af1e8e9493695a98dd6931347838a8',
    ],
  },
  {
    code: 'W7_9',
    hashes: [
      'd5e9575b7f699e998288b2ec646ac349a87fb5647d5710a1c98dc911fd9d35b3',
      '7dba73869a483599f3c2ce58d5836aa9d8ab4bdb08477ceb18ef683e8d09c2fd',
      '3e94eadbca33a3041584d76763ed785ff2ba7a2cd6b2ed65599f897646329a80',
      '264fa010a31e0fcc2b900f92af681c22cc273eaa3b70884454082052b85028c5',
    ],
  },
  {
    code: 'W8',
    hashes: [
      '5334233acd0f3b87f02b3f2c63b99b28938f2ecb3e9410af8d847a3eb744a36f',
      '943fc63aeb70a6c60a025c22043e7f3aff661674110fd396c85f9ebea24d62a1',
      'a47b4f70414c498e64b00429edc89b1085f112b9a2c3f59596f7ed96cc670ad8',
    ],
  },
  {
    code: 'W8_4',
    hashes: [
      '5c7536dcd18d90204f0a63391b54d3814d7bd802bc4fdf48492650387ab8ad7e',
      '99eb2d8d67aa6534ae0bf3a91f7093d4c19856ae593d76788926ce6d839792df',
      'a01bdb7699661898017ad74272a0556b4b7ef5759389e688f73b3ad0ccfeb1c2',
    ],
  },
  {
    code: 'W8_5',
    hashes: [
      'ce367409debf11a36ed80f5e01cb88dad3278f5238e6f1a5f2556bf13ff52aa7',
      '533b3bb287049f5f94ae40d534e99c6c34a5e8e33063b7568a4e2354ff12f403',
      '50f5d78d21f23963cee68169e33fc4ecc2a15dec4c7b39cb1b8aca825ee6b1ce',
    ],
  },
  {
    code: 'W8_5b',
    hashes: [
      '02a88b8c249119ea27bfd168dacd947cccbdbd2be65d6094e952ac1162dc3d41',
      '60f6794e03faefc80e254ef0405ed731d04a7718ce98545640ce87a566529a31',
      '8935f159627973037780e4e4605eef49ea971505b39b0c154ff7a7a29801a3f8',
      '2a934435462f7d5f67df18d896c7b67eddf435486b5f13a693138b530ffc2fa9',
    ],
  },
  {
    code: 'W8_6',
    hashes: [
      '51bef61c2fa9b06253368e1d4161f352b9c9e60f7c120746c7b082c7989f7c57',
      '7ab6110d9150ac5a48e71589c21fed1306dd6ecf11806f951b45d03e50027fa5',
    ],
  },
  {
    code: 'W9_8',
    hashes: [
      'd6478435cc0787f543c4cba5a3abba9bc294ecdb1630b821e6e9e579f1839175',
      '439b88e9a30e9ff71cdea98b5077181631fae2803c147f73e6e5cf357a356eb5',
      '53cb5a3e9ca64d760cac813eea26d82bb7b348c76d620fbe46ff84f63d0239e7',
    ],
  },
  {
    code: 'W10_8',
    hashes: [
      '7a6262a9db588b81ebca1f608436f73109e170ab91ab3df51e1721870741f388',
      'a4447c92fed33b2d1be5c1133b9fef06cd2b1bd2f2c26faac9d3cfd919e56b81',
      '44b35cccf47cb520a53644d99b434d417988b88fee5e9d775e366728fc8115ab',
    ],
  },
  {
    code: 'W11',
    hashes: [
      '4b72c5da6b7a65da9dbc91d9b92d13d9ff515f05fb7bc7a5b5bdb6cae5df3b85',
      '99decf42c8db1a11d221a9552261c662127eff88747bdbbf017fc6158ce671ee',
      '8b00b9f4dc9c8b326de04c0afbbfc1ae4ba91ddefd31dbebfd50d58f4a6dcacb',
    ],
  },
  {
    code: 'U5_5_6',
    hashes: [
      '465d2fa83890e486f948a0594ceb6bf7c9ca28751e0d30e0a0beb664454dac31',
      'a5cb1ee748b4c3cba6c448b300d82d796e37709e202bb338748638c80b23f7c8',
      '65014c28e62728637a760f4f97deb53662f156581464a84fde7ab8bc5da65d79',
    ],
  },
  {
    code: 'U5_7_2_9',
    hashes: [
      '29f290277a95a7bfff52dd2018a0d8bc2effbaf686292bc7033b1e46b2c530ff',
      '996b8e3f7583627f6a77fbf18d0f92fc3a6da139e090b3f5c1fa78eb94fcb475',
      '4c5d60ad545c73db0833d4c895031a0c514f0e15ead4a1682f302c2ad729b943',
    ],
  },
  {
    code: 'U8_6',
    hashes: [
      'a57712a775b5a07187ee39381f4b349acbdd4d6b6fc9e9e9ab2e9483075c8f14',
      '9952eb70942e2e5b4b0acccc0ee603d37f3a280d21395242975af0578e3815ff',
      '858886c01ac6d5f14ec60118eef77ab72a4714851a7fe88efa1ef63699047fa2',
    ],
  },
  {
    code: 'U8_10',
    hashes: [
      'c90922d890af3e35a597ccbf875536219452abb3611ece75bab1b4e525ac7b9c',
      '3d651f28484a1ee95f6c6cc43b099c607dcaff8e350f8cff44d0858735a34327',
      '5cf4628f0c206029b72ff0f06b64cea88159b85d2d893bcb551b6783f2bb5ad4',
    ],
  },
  {
    code: 'U10_6',
    hashes: [
      'c058d34d312bf86fe3ce2f8fa6dc8e93c37d0ad09cdbbb9279e754ab3a36d206',
      'cab77eb58f71d21cc847e37e975aa8c209b413044a96651544c57b1665f9f21f',
      '32a5e0d88433e38b66bdf2445d970f38cb26cedd05aa9fb4e1f15c3c76722bb6',
    ],
  },
  {
    code: 'B6_3_11',
    hashes: [
      'ecd1a6fc5eae2eb3e972abb218ae3893143b319b0e0c971c4e201acd552c2855',
      '3673d45fd69eba4cc0ac46bdff44cd0197342041950ae9cd6caed2cbcecb2f23',
      '417ecc79159d8996bacfd0d54447df0d0bda3c2eced6b332e345135f2e3be658',
    ],
  },
  {
    code: 'B6_7',
    hashes: [
      '18709778cf913a03d4158fe787f87a2648bfc0197628507b6d7f09b0fdafdd60',
      '4860ab4f1ff25d919724ea1d884256b66d4fec4c63578fa17fab1c686e951f21',
      '48913f8491efa47a2f1699aee0db58e2cb8dd9da07a3d658fb987a6c7cb711ac',
    ],
  },
  {
    code: 'B6_8',
    hashes: [
      'd2a0f19408976ba9d654b552db99ed57c242cb1e99f83ba10919f9c345267982',
      'c22f7120799c6057473fb35c058ff72d2cdf48578513cf7294360851701d2d23',
      '651a617ed11b5794993a7441ba09cb4ec83499041807a6236b3aa0f1dd55914e',
    ],
  },
  {
    code: 'B7_8',
    hashes: [
      '656da0e2780c025aa719d3392ec47fdf20d9ebd2ef75fb6342ef9b53d6d16b41',
      '029726bcca28da487a9a8c4ce7453516a21a2e274d118fffb90a2b87ccd28649',
      '50550917b2ceb2b24404847e5b75f7dc771f0052853f473a08f7f1fab0d64750',
    ],
  },
  {
    code: 'B8_3_8',
    hashes: [
      '483195d709ab86c8061e4d9dfef94ee2f08bad0733ba8fb00dfa973518ef2b5d',
      'fd4a79dd1d921aaa327bf6dbdae368eec0824e93fc2b70d36ac9b10b5de5e2db',
      '4dfd9f0ab46c99706e935c9530160c9b906cc86db485c151c707b12597b37cd4',
    ],
  },
  {
    code: 'B9_7',
    hashes: [
      'e94ff3940bed921ee795b445350322f5c0bb7d136e6b7f6f5cdbecb3391c70c9',
      '80dfe7ca0e867a5448c401ec262eceaadbbf15cdfd3eb844c747757be2149966',
      'a4e8ec7fc70165cbb830672c9ff5324b0ebf0cb1eb17dd25f0c86636c484d950',
    ],
  },
  {
    code: 'B10',
    hashes: [
      '0651f84f529b8a8e94f4a0d86a43564e2a058ce155b4e7ccfbf8602a09b29c91',
      '7e6a0525a8dfb5ba54197caf76b2fc5b4eaefae397fc353b0772abf09c96896d',
      'cadbf07718a0cc05e985d55e94c004726a150b239eed8246a7e56c2e48b4e4ee',
    ],
  },
  {
    code: 'R5_10',
    hashes: [
      'bb91917144b635f4fed1fbb14383cceada3781b68c5db9a8d5bd9174e00aedf5',
      'a65b46ea07eab4b3246d3e1a33accf5c7f04ef273d85d5b82bbc4634567f2133',
      '03e019c028a5030684f82f9a4ded8131c7c65f115a0b5739eeea15b51ad2ab0a',
    ],
  },
  {
    code: 'R5_11',
    hashes: [
      'a51e45b843c5d281a0fe0879065386504a43304f061957acb4d71be9b3187f35',
      '9bb136fdb5864fac499d3e185e5c43abd03740033951a61cc14196de5978299c',
      'fed1f7e3adcf255f032853c550267b356cd289df05568434b7d56f67e7d8b833',
    ],
  },
  {
    code: 'R6_9',
    hashes: [
      '03f667d26ba9bd3c3ff2b181106bdef8143a6502c59130a820137c064807690a',
      'bcd0c1e3627b224ea5d1963f8a3eed3850ef82ba1cfe6214146d245fbc20a151',
      'b2d59a47f1496b95887f45216a4f9a1a86be6a3166cfbf360625ff14a090334c',
    ],
  },
  {
    code: 'R8_10',
    hashes: [
      '8177271cd280815b066573deb91ee9ad4d4f719d285a7e7cb6c85d85e253c8d8',
      'a1fed86dd8e9cc7f7d895872385c33a6e6cfbb8cc8f53f2b08c48ebf81f6d492',
      '6c2423601672ef2df1f09e2dd50814f6d71ba5276a45037a0871e8309015ca80',
    ],
  },
  {
    code: 'R8_10b',
    hashes: [
      'e9f1a798649e200ace88b99cc5664cd175cfe7d0f193509f3ce1319faf792add',
      '54d70772f501e7240364a0c04e7009f1f2ca52ed25be59b272821b302468d443',
      '9b52d57987247d81687c789858f68a53c463b6ddda944b7930b2a6ee8f82602a',
    ],
  },
  {
    code: 'R12_6',
    hashes: [
      '86fddb0e6d37b1464f84c1c4553ab50d365f73a512643d581f54fb40379f04e7',
      'a45688d89d02e0e5eb06d34ce45f2753fb72ca96985f27ca9b0dd51cf146a7c7',
    ],
  },
  {
    code: 'G6_9',
    hashes: [
      '51e0b5a3fa84615b0d6dc09cd0206173a18d34c9b9ab23edca98da6fe2fba1f7',
      '5e4778c51f4330909b51cbd60810db3f6503ece9eee9e8881af15ea1f977f4bf',
      '6234e5080756a7c230c248b0e0626e3952c25a59cfa78b2691669ccb6c3986fc',
    ],
  },
  {
    code: 'G10_9_6',
    hashes: [
      'b660c7af86056e6a3082541a14043983bfb3fef55e088755fa69aebadf4fefdd',
      'd7caedf26f59f0f1cdd3194ebd6d51035bc865e20bbb242cbecaedefe20f3f7a',
      'd517d18b6158c74807f2aa2cb7aafe804e3f6a50978c8a3f2db0ef81297ad1cd',
    ],
  },
  {
    code: 'Z4_3_3_3',
    hashes: [
      '151355ad27dc627f1069409376182a8afa27cac5f11eac9bd9355f1d5abc21aa',
      '24e6a6cd5777414bc01800cdc55b66887f2abace4214053773d1f3432b87c688',
      '2138be6598a23592861cbafeac83cd1d5a5949c068e3ff8f0459552a11ab81a0',
    ],
  },
  {
    code: 'Z5_1_4_8_6',
    hashes: [
      '65ec27dc7006e1e21eab34f8ef39068e055122361ae4c9ff4a084bdaba296660',
      '8ef7863911e2945fdc78f3ecde00f0edfcefecee0d01d1fdfb615009e26a767e',
      'cf9d59fea5be35944c4b0d24f1cfa2a55e6bdfa07daf0b7db763ae01d9b5a65e',
    ],
  },
  {
    code: 'Z5_10',
    hashes: [
      '6f67a9e1d5470df3e4f18019e088b1ec0acb457e99360aa184e158789957c267',
      '8261ba7102b6fe1f1f0a12b8975609b029724d22d4bf0b44edf8fc55cd523b0a',
      '30f3a50302ae349a4c87f710ba494993bc7f375d2aac5cb4cec71514ffecaf58',
    ],
  },
  {
    code: 'Z6',
    hashes: [
      '00b98fbe67a35fae066af21b73f9ebd1eefbd67d5a45a8df4615baaeb1dd0c2c',
      'ff3f91878dc2bb9f7c81dbc0ce1625fc21500dc7b01c5ec05450d0908068db9f',
      '686638f894994e2db83a1cb34e7c13443eaf9690f328b82edcf34a9977b2bb04',
    ],
  },
  {
    code: 'Z7_7_7',
    hashes: [
      '657756673f616ece730126c0aec41afdc5d42f53fd593854e6f8b2dbb9ea0df9',
      '3992ff3d9eb3298481b4f496e9afc3537fb7835cb90143f5de686872a8cb5465',
      '3351da874f1510e29393c2519296cb66f853229c5cc28a3d97262a384db709e6',
    ],
  },
  {
    code: 'Z7_8',
    hashes: [
      '56abaed6b46c7bc5dd615822227bbec16ca3605ac4a1dafd3d14b8ed7d6d5f55',
      'f3466391ede4ae0292831c5240ce9e56de2714a9445f0d4342294719dbaf624f',
      '7a26a940aaa3806653b459795f33d6bb125bbab3198a4511dc4c215e25923ba1',
    ],
  },
  {
    code: 'Z7_11',
    hashes: [
      '352837dc4754c6d6bd3082a598ee4ceb0bfb8391d6011f58e12e33ae75c0fac9',
      'c9bfa02e782caa0a326e62c0c480208047b780092e212a859152ceb2ba1d09c9',
      'e947c67d1f3d69c88b73b74ac23a30b20b2a61094e6d22da64c88b3c4d005e06',
    ],
  },
  {
    code: 'Z8_3_9',
    hashes: [
      'f083b00b537eb24796272ebf8dc6dfd4c070f771f3277e56427529ab58df8005',
      '40bfee41ded7f90c2cc9e1d22d187ae040ed942c70b103af94f9086f6ffdc650',
      '25b337d44df8033b7797721f745149d9182b669634b95451cabde44c58694912',
    ],
  },
  {
    code: 'Z8_5_5',
    hashes: [
      'b6fe323dd1dd35fad354a26fd8dd9da4503e17b5da7f4c55fe039bc156ad0da0',
      '3cf10b8140afc6aa97e3000da9b5c1b24444f3771442726bfda603236b22147f',
      'bd62c9303f075834eba7ef8b373865eb1aa04efa91e55fa26460c0e6d00b7001',
    ],
  },
  {
    code: 'Z8_8_6',
    hashes: [
      '7317914f97a4b4123178c0f9d9a07a3b362aa3240651cf08178f72358b390fde',
      '030a504e827b84d6478aa1218d12cf9f48cbe61037ae76bf306033743541e498',
      '7b30d4d2ed50277d78c26a274dd1edc145f334eb75daf5a6fa15efe8c0e330d5',
    ],
  },
  {
    code: 'Z8_8_6b',
    hashes: [
      '1ff8b14ba6733a77055c0d8b935d8882ef22d5bd8b40d38aa5bf85a5bd2d2961',
      '9059950391d381d5f6ab7ed38d590bb89b028498981186f6247a313f83a052d4',
    ],
  },
  {
    code: 'Z9_3_8_5',
    hashes: [
      '8c2dd9d846b17229adfbd6423856d9b3000c496439ecb8ec9e6fa33ac94eb19b',
      'a66731d0227ba2ac5ae1985e2c7b8e47ef034e11183deb5a12087012907a91df',
      'df1d8d3c79fd5205dac9985a778cfb7997fff7c488549aa6e12b67749f650be0',
    ],
  },
  {
    code: 'C5_5_7_3',
    hashes: [
      'b5af0401e503b608e3a7f128c6d7a49db683280cd57da63a58ef9546c5822537',
      '8c526ffcfcbe657b4f4793ad2f16a886d09a707aec2ebf11c84f5ebeb6e2016d',
      'ff6b8f0ed0e17de64fa64cf96659434ce91167af77b017423e496092b7ad522d',
    ],
  },
  {
    code: 'C11_7',
    hashes: [
      '8972a769c0e48ba1258d0a366fb41df35c0116aa9c3ea19be022a05e91b6b8c5',
      'bd3b87796f2cc9e6ab652b8023ac415b725d764277859f1aae5e6079a8825315',
      'b5f3e5e978128c2db15cdf7ea50ba5d4c7229d07418c05d784e617deae280add',
    ],
  },
];
