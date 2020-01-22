/* eslint-disable */
import fs, { promises as fsp } from 'fs';
import path from 'path';
import rimraf from 'rimraf';

import esort from '../src/external-sorting';

interface IFriend {
  id: number;
  name: string;
}

interface IName {
  first: string;
  last: string;
}

interface ITestObject {
  _id: string;
  index: number;
  guid: string;
  isActive: boolean;
  balance: string;
  picture: string;
  age: number;
  eyeColor: string;
  name: IName;
  company: string;
  email: string;
  phone: string;
  address: string;
  about: string;
  registered: string;
  latitude: string;
  longitude: string;
  tags: string[];
  range: number[];
  friends: IFriend[];
  greeting: string;
  favoriteFruit: string;
}

describe('sort', () => {
  const tempDir: string = path.resolve(__dirname, '.tmp');
  const outputPath: string = path.resolve(tempDir, 'output');

  const flat10intPath: string = path.resolve(__dirname, 'arrays', '10_int');
  const flat10int = [1551, 5773, 4349, 3118, 2558, 1927, 1193, 3373, 3464, 392];
  const flat100intPath: string = path.resolve(__dirname, 'arrays', '100_int');
  const flat100int = [
    5282,
    3000,
    3833,
    5867,
    9097,
    7864,
    9490,
    7548,
    6143,
    775,
    236,
    6228,
    7135,
    6585,
    413,
    8540,
    193,
    1819,
    6901,
    1713,
    9668,
    4046,
    6675,
    1740,
    8896,
    4076,
    7284,
    6945,
    9198,
    784,
    8185,
    7029,
    6454,
    6774,
    491,
    946,
    2879,
    8053,
    3568,
    4753,
    5361,
    6473,
    3342,
    3343,
    3275,
    2516,
    3657,
    2713,
    404,
    5694,
    6829,
    7441,
    6999,
    3321,
    8134,
    5315,
    5975,
    3814,
    2513,
    1395,
    6819,
    7943,
    456,
    7287,
    3442,
    7051,
    9720,
    6283,
    8194,
    2646,
    4066,
    1084,
    1403,
    6863,
    1868,
    6479,
    9162,
    9224,
    6017,
    6486,
    7031,
    3658,
    7258,
    6267,
    1364,
    5611,
    5103,
    6399,
    1901,
    4876,
    8021,
    5757,
    8016,
    2827,
    587,
    2869,
    7783,
    73,
    5935,
    5295
  ];
  const flat100stringPath: string = path.resolve(
    __dirname,
    'arrays',
    '100_string'
  );
  const flat100string = [
    'Kyojguab88',
    'Z2mhxwOrT0',
    'n8ulGaBQJt',
    'Np4GGuFkxz',
    'HHJ5pY6UIa',
    'CarZnxdq77',
    'tY7lga0gNt',
    'owxzVCzY2c',
    'zC0COALWHk',
    'gSfP3rMEKL',
    '1L0CGdriQg',
    'jHKp8vV5z2',
    'Mbx3FE4x5m',
    'ii6I8ciuHV',
    'zEtbJnm5jm',
    'dVq2ZahqXR',
    '0IQpM2BWhX',
    's9SOLIAxIN',
    'pt1g13h3ae',
    '270yUYzcIj',
    'gguQQkjqRK',
    'NHVyTBxTuE',
    '1Eut6m3GNP',
    'cG30xlOefv',
    'XuVla0A7Da',
    'EsdwTUUUCN',
    '4315H2LXJk',
    'oYNrTGOxLh',
    'vLZHcX7u56',
    '4uewME4RVH',
    'D3Wh2qgLlg',
    'AqAg6UNjfq',
    'G11z758AmF',
    'wReQPfzM9Z',
    'oXDkScgwMO',
    'GvmDQyuO8G',
    'jdFkufuDeA',
    '5eG8E1jnl5',
    'uXLs4RT0b1',
    'vEnp3hOTlw',
    'J4ciwQfM3l',
    'vnZ5MgDqk9',
    'h3Oud7itg9',
    'Jy4AX1kBxr',
    '1z68iBB9PX',
    'XIXApkNhow',
    'vZhILXRrDK',
    'CY9sZffqpI',
    'Nnj0jJyJHg',
    'nILeAZ01dy',
    'i63FIcmFaL',
    'N2ECWOJf60',
    '1DEhuKWBHh',
    'QVXMtzjNXk',
    'PzQRyt2d2T',
    'YmmI3ThWan',
    'Agqb0mBsfE',
    'Xucu2QxPvN',
    'ITkHhEFXd5',
    'DICWSZlnab',
    'aq4Df6XTyy',
    'mUSyBWURU1',
    'IgBaSqh9Cc',
    'xSc2pWLi6n',
    'yTgNLhC2wX',
    'CVmpWgqj1T',
    'JekfXMDrs1',
    '6HNTM6P8li',
    'EHl7SqqVku',
    'bFCRjHvANM',
    'GlRjVEslI5',
    'G6LsutQiaH',
    'ksJOnnOeLj',
    'jMnzQOHBKg',
    'MQ0QOsSRKR',
    'UPdPpsNnkS',
    'u8HdtrWlbA',
    'hWuhlbMvrP',
    'weqvBPj9WV',
    '9jPxGBaktd',
    'xqHJRf1aEG',
    'fvGfegipou',
    'opoSxj5hEG',
    'n1T9Kc4kSk',
    'Wa8RUchP4f',
    'we4B9uXC2d',
    'YlUAYfRtZY',
    '2M01t2OVJr',
    'qnVbM7jSbp',
    'uKfTsh3XPE',
    'DyETuzcGsC',
    'Fy01kE7Xdw',
    'TK4DCY5I6v',
    'ORsWVBGUCV',
    '4zGFeG9zp2',
    'SXmRcMD5nN',
    'IfwhP1gVDI',
    'szrs6obcw3',
    'ydAJGjxtIe',
    'UGavWnvHx2'
  ];
  const flat100objectPath: string = path.resolve(
    __dirname,
    'arrays',
    '100_object'
  );
  const flat100object: ITestObject[] = [
    {
      _id: '5e2824ba77357fc24dad121d',
      index: 26,
      guid: 'd3782442-ca52-4418-884d-6a437eccc274',
      isActive: false,
      balance: '$3,342.43',
      picture: 'http://placehold.it/32x32',
      age: 31,
      eyeColor: 'blue',
      name: { first: 'Donovan', last: 'Ayers' },
      company: 'EXOPLODE',
      email: 'donovan.ayers@exoplode.name',
      phone: '+1 (923) 553-2626',
      address: '649 Benson Avenue, Rowe, New Jersey, 1927',
      about: '',
      registered: 'Monday, February 20, 2017 4:44 AM',
      latitude: '-75.661829',
      longitude: '119.809546',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Barry Klein' },
        { id: 1, name: 'Clayton Browning' },
        { id: 2, name: 'Knowles Mitchell' }
      ],
      greeting: 'Hello, Donovan! You have 5 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba451625d6255c4db7',
      index: 9,
      guid: '2891dee1-0210-4984-8bb1-cb3800666c1b',
      isActive: true,
      balance: '$2,332.44',
      picture: 'http://placehold.it/32x32',
      age: 27,
      eyeColor: 'brown',
      name: { first: 'Jefferson', last: 'Compton' },
      company: 'GENESYNK',
      email: 'jefferson.compton@genesynk.biz',
      phone: '+1 (965) 424-3787',
      address: '599 Cozine Avenue, Williams, Guam, 6833',
      about: '',
      registered: 'Saturday, April 2, 2016 9:52 PM',
      latitude: '-14.185383',
      longitude: '89.652822',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Karla Hunter' },
        { id: 1, name: 'Fitzgerald Blake' },
        { id: 2, name: 'Brianna Rose' }
      ],
      greeting: 'Hello, Jefferson! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba78de9fd314b40924',
      index: 68,
      guid: '84aa8962-bcf5-441f-b48b-24bc219ac98e',
      isActive: true,
      balance: '$3,546.08',
      picture: 'http://placehold.it/32x32',
      age: 31,
      eyeColor: 'blue',
      name: { first: 'Velazquez', last: 'Whitley' },
      company: 'MULTIFLEX',
      email: 'velazquez.whitley@multiflex.ca',
      phone: '+1 (829) 560-3346',
      address: '532 Bridge Street, Soudan, South Carolina, 4481',
      about: '',
      registered: 'Sunday, June 9, 2019 11:15 AM',
      latitude: '81.433358',
      longitude: '65.129899',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Myrna Patterson' },
        { id: 1, name: 'Wong Rosa' },
        { id: 2, name: 'Gill Bryan' }
      ],
      greeting: 'Hello, Velazquez! You have 7 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba8d2bd6bc0b8f1d8f',
      index: 94,
      guid: '9c3dfb3e-59d2-4743-92d5-d397da7afaf2',
      isActive: true,
      balance: '$1,172.98',
      picture: 'http://placehold.it/32x32',
      age: 29,
      eyeColor: 'brown',
      name: { first: 'Holden', last: 'Cook' },
      company: 'NURALI',
      email: 'holden.cook@nurali.io',
      phone: '+1 (983) 589-3043',
      address: '653 Jerome Street, Lisco, Arkansas, 7628',
      about: '',
      registered: 'Wednesday, February 13, 2019 10:48 AM',
      latitude: '6.640781',
      longitude: '73.500381',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Gordon Cannon' },
        { id: 1, name: 'Anthony Gallegos' },
        { id: 2, name: 'Ebony Villarreal' }
      ],
      greeting: 'Hello, Holden! You have 6 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba9b2ac7e46db11281',
      index: 31,
      guid: '6a16278d-46ab-46cd-b6a7-805969e0e065',
      isActive: true,
      balance: '$3,444.52',
      picture: 'http://placehold.it/32x32',
      age: 23,
      eyeColor: 'brown',
      name: { first: 'Mckinney', last: 'Bolton' },
      company: 'VIOCULAR',
      email: 'mckinney.bolton@viocular.co.uk',
      phone: '+1 (814) 554-2864',
      address: '473 Blake Court, Coloma, Connecticut, 3558',
      about: '',
      registered: 'Tuesday, June 13, 2017 3:29 PM',
      latitude: '40.486196',
      longitude: '163.996817',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Haney Hill' },
        { id: 1, name: 'Wilcox Herman' },
        { id: 2, name: 'Cross Mathis' }
      ],
      greeting: 'Hello, Mckinney! You have 6 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824baae0456f31fade7f0',
      index: 5,
      guid: '1eb2d555-a011-4a02-99f9-c251037a4544',
      isActive: true,
      balance: '$3,329.21',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'blue',
      name: { first: 'Jacobson', last: 'Gay' },
      company: 'EXTREMO',
      email: 'jacobson.gay@extremo.tv',
      phone: '+1 (821) 597-3941',
      address: '723 Jay Street, Gallina, Tennessee, 9719',
      about: '',
      registered: 'Monday, February 13, 2017 1:54 AM',
      latitude: '-48.609089',
      longitude: '-25.912615',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Wynn Justice' },
        { id: 1, name: 'Puckett Burt' },
        { id: 2, name: 'Angelia Rodriguez' }
      ],
      greeting: 'Hello, Jacobson! You have 9 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba2d246f205eacb512',
      index: 70,
      guid: '34cc5081-8eb9-4ade-b983-a479688df068',
      isActive: true,
      balance: '$3,189.13',
      picture: 'http://placehold.it/32x32',
      age: 24,
      eyeColor: 'brown',
      name: { first: 'Jenny', last: 'Lancaster' },
      company: 'EWAVES',
      email: 'jenny.lancaster@ewaves.io',
      phone: '+1 (922) 579-3131',
      address: '269 Cherry Street, Martinsville, Alaska, 3665',
      about: '',
      registered: 'Thursday, January 28, 2016 7:41 AM',
      latitude: '-68.906977',
      longitude: '-5.00749',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Campbell Sexton' },
        { id: 1, name: 'Shanna Fuentes' },
        { id: 2, name: 'Kristina Richards' }
      ],
      greeting: 'Hello, Jenny! You have 5 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824bae0f4d57f7d2d4aa5',
      index: 20,
      guid: 'a20df83d-2c3b-4963-bda2-b1e5191ed8e8',
      isActive: false,
      balance: '$1,793.83',
      picture: 'http://placehold.it/32x32',
      age: 30,
      eyeColor: 'brown',
      name: { first: 'Carolina', last: 'Aguirre' },
      company: 'ANIVET',
      email: 'carolina.aguirre@anivet.ca',
      phone: '+1 (938) 438-2658',
      address: '557 Kay Court, Highland, Nevada, 415',
      about: '',
      registered: 'Sunday, October 26, 2014 11:32 AM',
      latitude: '15.725244',
      longitude: '-101.247286',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Mcneil Luna' },
        { id: 1, name: 'Montgomery Lambert' },
        { id: 2, name: 'Adeline Byrd' }
      ],
      greeting: 'Hello, Carolina! You have 10 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba35036d9ce3c2afac',
      index: 27,
      guid: 'ce97bee5-654f-4f86-94cf-e3a1365ffbb0',
      isActive: true,
      balance: '$1,813.55',
      picture: 'http://placehold.it/32x32',
      age: 24,
      eyeColor: 'blue',
      name: { first: 'Mathews', last: 'Levine' },
      company: 'SINGAVERA',
      email: 'mathews.levine@singavera.org',
      phone: '+1 (818) 592-3288',
      address: '667 Bowery Street, Wanamie, Illinois, 4886',
      about: '',
      registered: 'Saturday, November 9, 2019 6:02 PM',
      latitude: '-24.204659',
      longitude: '171.222253',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Deleon Blackwell' },
        { id: 1, name: 'Virginia Black' },
        { id: 2, name: 'Gwen Morales' }
      ],
      greeting: 'Hello, Mathews! You have 9 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824baea7dbb42b3ac7ec7',
      index: 89,
      guid: 'f9c25528-2000-494d-8b51-16289116722b',
      isActive: false,
      balance: '$2,531.49',
      picture: 'http://placehold.it/32x32',
      age: 24,
      eyeColor: 'blue',
      name: { first: 'Nielsen', last: 'Bowen' },
      company: 'STRALUM',
      email: 'nielsen.bowen@stralum.tv',
      phone: '+1 (998) 537-2385',
      address: '200 Covert Street, Colton, Connecticut, 3619',
      about: '',
      registered: 'Sunday, September 25, 2016 12:18 PM',
      latitude: '-0.203468',
      longitude: '-27.882458',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Mcgee George' },
        { id: 1, name: 'Rosanna Sampson' },
        { id: 2, name: 'Conrad Dominguez' }
      ],
      greeting: 'Hello, Nielsen! You have 9 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba73731c6e5a8c429e',
      index: 45,
      guid: '222598ac-25b4-47af-8ba6-726cbf55ef42',
      isActive: true,
      balance: '$3,515.17',
      picture: 'http://placehold.it/32x32',
      age: 25,
      eyeColor: 'green',
      name: { first: 'Rita', last: 'Oconnor' },
      company: 'QNEKT',
      email: 'rita.oconnor@qnekt.biz',
      phone: '+1 (968) 584-3530',
      address: '976 Dahlgreen Place, Stockwell, Oklahoma, 8935',
      about: '',
      registered: 'Sunday, June 30, 2019 2:24 AM',
      latitude: '-2.428419',
      longitude: '7.695324',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Gillespie Rasmussen' },
        { id: 1, name: 'Natalie Osborn' },
        { id: 2, name: 'Simon Francis' }
      ],
      greeting: 'Hello, Rita! You have 8 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba52ac1f408d671785',
      index: 63,
      guid: 'afd93e8b-dab1-4c86-bca0-69400bbd820f',
      isActive: true,
      balance: '$2,482.02',
      picture: 'http://placehold.it/32x32',
      age: 39,
      eyeColor: 'green',
      name: { first: 'Jamie', last: 'Gentry' },
      company: 'MAZUDA',
      email: 'jamie.gentry@mazuda.org',
      phone: '+1 (828) 442-2170',
      address: '736 Kenilworth Place, Loma, Tennessee, 2040',
      about: '',
      registered: 'Wednesday, December 6, 2017 11:53 AM',
      latitude: '-34.47847',
      longitude: '158.042075',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Lott Mcmillan' },
        { id: 1, name: 'Grant Carver' },
        { id: 2, name: 'Brigitte Holcomb' }
      ],
      greeting: 'Hello, Jamie! You have 10 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba52e8727857f257d3',
      index: 18,
      guid: 'f79ceb39-1631-44c2-a10a-8626cce85375',
      isActive: true,
      balance: '$3,367.51',
      picture: 'http://placehold.it/32x32',
      age: 39,
      eyeColor: 'brown',
      name: { first: 'Ophelia', last: 'English' },
      company: 'COSMETEX',
      email: 'ophelia.english@cosmetex.info',
      phone: '+1 (963) 465-3184',
      address: '798 Woodrow Court, Osmond, Nebraska, 679',
      about: '',
      registered: 'Monday, June 29, 2015 9:05 AM',
      latitude: '-30.006509',
      longitude: '175.467127',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Buckley Martin' },
        { id: 1, name: 'Penny Cain' },
        { id: 2, name: 'Collier Reeves' }
      ],
      greeting: 'Hello, Ophelia! You have 5 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba55ca48afd4275323',
      index: 93,
      guid: 'c25521dd-0b52-4cd1-aeea-d3f8e02e2dec',
      isActive: true,
      balance: '$2,173.29',
      picture: 'http://placehold.it/32x32',
      age: 36,
      eyeColor: 'green',
      name: { first: 'Nelson', last: 'Harrington' },
      company: 'BEDDER',
      email: 'nelson.harrington@bedder.biz',
      phone: '+1 (851) 422-3974',
      address: '450 Otsego Street, Chamberino, Florida, 957',
      about: '',
      registered: 'Monday, March 14, 2016 9:15 PM',
      latitude: '-42.096242',
      longitude: '113.914322',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Mayo Wallace' },
        { id: 1, name: 'Marta Dunn' },
        { id: 2, name: 'Luann Atkins' }
      ],
      greeting: 'Hello, Nelson! You have 6 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824bae5055429c07fdf8c',
      index: 75,
      guid: 'c94ef62c-e9db-42d3-93af-011d51fa0b62',
      isActive: true,
      balance: '$3,568.72',
      picture: 'http://placehold.it/32x32',
      age: 30,
      eyeColor: 'brown',
      name: { first: 'Kaye', last: 'Wooten' },
      company: 'SHOPABOUT',
      email: 'kaye.wooten@shopabout.org',
      phone: '+1 (939) 536-3220',
      address: '110 Tech Place, Kiskimere, Hawaii, 4242',
      about: '',
      registered: 'Sunday, June 23, 2019 8:28 PM',
      latitude: '-80.353218',
      longitude: '-129.012752',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Blankenship Ward' },
        { id: 1, name: 'Hallie Kirby' },
        { id: 2, name: 'Cohen Wagner' }
      ],
      greeting: 'Hello, Kaye! You have 7 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824bab0a1f74819a55fcc',
      index: 32,
      guid: '57c28b55-9941-414d-a0b5-139d45cb38e1',
      isActive: false,
      balance: '$2,960.91',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'green',
      name: { first: 'Macdonald', last: 'Peck' },
      company: 'EARWAX',
      email: 'macdonald.peck@earwax.ca',
      phone: '+1 (905) 510-3080',
      address: '123 Krier Place, Fresno, Michigan, 2732',
      about: '',
      registered: 'Friday, April 12, 2019 9:47 AM',
      latitude: '-87.072606',
      longitude: '99.754115',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Jacquelyn Robles' },
        { id: 1, name: 'Morin Cross' },
        { id: 2, name: 'Sheryl Dyer' }
      ],
      greeting: 'Hello, Macdonald! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba1e0b9cbbaa783fa1',
      index: 51,
      guid: '7477a630-bf56-40c1-a2b9-234deb704f7f',
      isActive: true,
      balance: '$1,973.40',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'brown',
      name: { first: 'Ewing', last: 'Cameron' },
      company: 'INSURON',
      email: 'ewing.cameron@insuron.org',
      phone: '+1 (937) 432-3369',
      address: '598 Seigel Court, Retsof, South Dakota, 9751',
      about: '',
      registered: 'Saturday, May 20, 2017 4:02 PM',
      latitude: '21.691052',
      longitude: '151.027998',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Wiley Finch' },
        { id: 1, name: 'Taylor Sloan' },
        { id: 2, name: 'Dollie Franks' }
      ],
      greeting: 'Hello, Ewing! You have 5 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba124cd738193d9ac8',
      index: 28,
      guid: 'e566c3f6-90ff-4b64-a01a-798ce4a86ba7',
      isActive: true,
      balance: '$2,843.03',
      picture: 'http://placehold.it/32x32',
      age: 29,
      eyeColor: 'green',
      name: { first: 'Alissa', last: 'Mcknight' },
      company: 'ZIORE',
      email: 'alissa.mcknight@ziore.us',
      phone: '+1 (957) 485-2210',
      address: '480 Neptune Avenue, Turah, Indiana, 6226',
      about: '',
      registered: 'Wednesday, March 15, 2017 10:39 AM',
      latitude: '44.651915',
      longitude: '93.13048',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Mitchell Freeman' },
        { id: 1, name: 'Cheri Chavez' },
        { id: 2, name: 'Cornelia Albert' }
      ],
      greeting: 'Hello, Alissa! You have 5 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824bae2fa17058d903cf8',
      index: 92,
      guid: '68fd6ba5-2c47-49d8-9853-50d154350133',
      isActive: false,
      balance: '$3,672.09',
      picture: 'http://placehold.it/32x32',
      age: 22,
      eyeColor: 'green',
      name: { first: 'Harris', last: 'Johns' },
      company: 'BIOLIVE',
      email: 'harris.johns@biolive.ca',
      phone: '+1 (895) 478-2668',
      address: '602 Bokee Court, Durham, New Mexico, 3223',
      about: '',
      registered: 'Monday, January 21, 2019 2:58 PM',
      latitude: '-31.775617',
      longitude: '-53.270266',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Cassie Mccoy' },
        { id: 1, name: 'Christy Perez' },
        { id: 2, name: 'Bryant Lewis' }
      ],
      greeting: 'Hello, Harris! You have 9 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824bab5eba344bb379b1c',
      index: 50,
      guid: '985f4e5e-ac0c-40cb-9963-f79b5d4dca1f',
      isActive: false,
      balance: '$3,919.87',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'blue',
      name: { first: 'Jacqueline', last: 'Floyd' },
      company: 'SENSATE',
      email: 'jacqueline.floyd@sensate.name',
      phone: '+1 (922) 496-3689',
      address: '351 Rutland Road, Crenshaw, Iowa, 7663',
      about: '',
      registered: 'Thursday, May 11, 2017 10:02 AM',
      latitude: '82.248673',
      longitude: '96.395776',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Levine Harding' },
        { id: 1, name: 'Patterson Nelson' },
        { id: 2, name: 'Dora Benson' }
      ],
      greeting: 'Hello, Jacqueline! You have 5 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba420efb7e78a3936c',
      index: 38,
      guid: '7d167a3f-d0c3-4fc9-b702-3ddbc7df9f5d',
      isActive: false,
      balance: '$3,770.00',
      picture: 'http://placehold.it/32x32',
      age: 33,
      eyeColor: 'blue',
      name: { first: 'Lynnette', last: 'Sears' },
      company: 'KATAKANA',
      email: 'lynnette.sears@katakana.name',
      phone: '+1 (846) 538-2815',
      address: '597 Senator Street, Cornucopia, Virgin Islands, 9192',
      about: '',
      registered: 'Thursday, November 10, 2016 2:56 PM',
      latitude: '-0.711128',
      longitude: '141.591502',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Kellie Bray' },
        { id: 1, name: 'Kim Calhoun' },
        { id: 2, name: 'Aimee Guthrie' }
      ],
      greeting: 'Hello, Lynnette! You have 9 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba3c16ac3a30108275',
      index: 78,
      guid: '0d609c08-215b-4d69-a804-992db5b6a1f9',
      isActive: true,
      balance: '$3,170.50',
      picture: 'http://placehold.it/32x32',
      age: 27,
      eyeColor: 'blue',
      name: { first: 'Marylou', last: 'Odom' },
      company: 'BLURRYBUS',
      email: 'marylou.odom@blurrybus.info',
      phone: '+1 (843) 478-2166',
      address: '689 Brooklyn Road, Villarreal, Nevada, 9645',
      about: '',
      registered: 'Sunday, May 17, 2015 8:50 PM',
      latitude: '-39.432679',
      longitude: '94.495413',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Joyce Cash' },
        { id: 1, name: 'Margo Wolfe' },
        { id: 2, name: 'Mckee Kennedy' }
      ],
      greeting: 'Hello, Marylou! You have 9 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba641a422340a7a887',
      index: 19,
      guid: '70f74919-5f8b-4cc8-a8a6-9a7998392217',
      isActive: false,
      balance: '$2,592.53',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'blue',
      name: { first: 'Myers', last: 'Spencer' },
      company: 'TSUNAMIA',
      email: 'myers.spencer@tsunamia.co.uk',
      phone: '+1 (818) 574-3640',
      address: '402 Post Court, Weedville, Maryland, 2112',
      about: '',
      registered: 'Friday, May 17, 2019 4:26 AM',
      latitude: '-73.226074',
      longitude: '90.738067',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Concetta Hancock' },
        { id: 1, name: 'Grimes Heath' },
        { id: 2, name: 'Myra Carrillo' }
      ],
      greeting: 'Hello, Myers! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bae16516db1a75aaf9',
      index: 36,
      guid: 'd090e3b6-3b6b-469b-96b0-512aa805928f',
      isActive: true,
      balance: '$2,418.14',
      picture: 'http://placehold.it/32x32',
      age: 32,
      eyeColor: 'blue',
      name: { first: 'Shepherd', last: 'Barr' },
      company: 'CYTREX',
      email: 'shepherd.barr@cytrex.me',
      phone: '+1 (814) 457-3604',
      address: '107 Bedford Avenue, Nogal, Arkansas, 2739',
      about: '',
      registered: 'Friday, August 22, 2014 9:12 PM',
      latitude: '-10.473092',
      longitude: '23.008918',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Vargas Mclaughlin' },
        { id: 1, name: 'Golden Abbott' },
        { id: 2, name: 'Felicia Miller' }
      ],
      greeting: 'Hello, Shepherd! You have 6 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba7e15197dfd911595',
      index: 79,
      guid: 'eb744b45-0a25-4977-ae1d-8d7789dae6e6',
      isActive: true,
      balance: '$1,983.42',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'blue',
      name: { first: 'Allyson', last: 'Hendricks' },
      company: 'MAINELAND',
      email: 'allyson.hendricks@maineland.co.uk',
      phone: '+1 (904) 493-3127',
      address: '462 Dakota Place, Bagtown, Wyoming, 1778',
      about: '',
      registered: 'Sunday, November 25, 2018 4:46 PM',
      latitude: '26.671223',
      longitude: '-109.602008',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Everett Ayala' },
        { id: 1, name: 'Annmarie Fitzpatrick' },
        { id: 2, name: 'Brown Good' }
      ],
      greeting: 'Hello, Allyson! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bafd57ec5b8485544c',
      index: 60,
      guid: '502fda53-06e5-49cd-8056-89f5fc642eea',
      isActive: true,
      balance: '$2,555.07',
      picture: 'http://placehold.it/32x32',
      age: 24,
      eyeColor: 'blue',
      name: { first: 'Stark', last: 'Daniels' },
      company: 'GRUPOLI',
      email: 'stark.daniels@grupoli.me',
      phone: '+1 (827) 411-2075',
      address: '473 Creamer Street, Jenkinsville, California, 9071',
      about: '',
      registered: 'Friday, September 1, 2017 3:39 AM',
      latitude: '-44.652954',
      longitude: '-44.751701',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Ellis Sweeney' },
        { id: 1, name: 'Roman Pollard' },
        { id: 2, name: 'Kristine Moody' }
      ],
      greeting: 'Hello, Stark! You have 10 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba0029851e91d4930a',
      index: 80,
      guid: 'ec5a7c2c-fe22-4c98-838a-0b3512b4564a',
      isActive: false,
      balance: '$1,965.28',
      picture: 'http://placehold.it/32x32',
      age: 34,
      eyeColor: 'brown',
      name: { first: 'Gena', last: 'Avery' },
      company: 'VERTON',
      email: 'gena.avery@verton.ca',
      phone: '+1 (920) 545-3726',
      address: '453 Quentin Road, Dana, Wisconsin, 9236',
      about: '',
      registered: 'Tuesday, December 12, 2017 8:17 PM',
      latitude: '72.448444',
      longitude: '-103.632104',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Kennedy Griffith' },
        { id: 1, name: 'Warren Pitts' },
        { id: 2, name: 'Frye Meyers' }
      ],
      greeting: 'Hello, Gena! You have 8 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824bac704207bb8bd8183',
      index: 72,
      guid: '050b5f49-240f-4062-9b9e-8e287e45f5bd',
      isActive: true,
      balance: '$1,642.37',
      picture: 'http://placehold.it/32x32',
      age: 35,
      eyeColor: 'green',
      name: { first: 'Mcdaniel', last: 'Best' },
      company: 'PURIA',
      email: 'mcdaniel.best@puria.me',
      phone: '+1 (810) 517-3045',
      address: '587 Newkirk Avenue, Alleghenyville, Arizona, 7522',
      about: '',
      registered: 'Saturday, May 19, 2018 5:36 AM',
      latitude: '54.849026',
      longitude: '-160.805699',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Chaney Mcdonald' },
        { id: 1, name: 'Sims Kirkland' },
        { id: 2, name: 'Patty Pugh' }
      ],
      greeting: 'Hello, Mcdaniel! You have 7 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824baca9994857a3222dd',
      index: 66,
      guid: 'e909a6a0-b6a9-4d40-9c14-db026ee2400e',
      isActive: false,
      balance: '$3,429.85',
      picture: 'http://placehold.it/32x32',
      age: 32,
      eyeColor: 'blue',
      name: { first: 'Willa', last: 'Petty' },
      company: 'COFINE',
      email: 'willa.petty@cofine.info',
      phone: '+1 (944) 543-2254',
      address: '410 Colby Court, Norris, West Virginia, 9331',
      about: '',
      registered: 'Tuesday, January 22, 2019 12:55 PM',
      latitude: '-76.531832',
      longitude: '12.921103',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Murphy Rowland' },
        { id: 1, name: 'Price Martinez' },
        { id: 2, name: 'Amie Garrett' }
      ],
      greeting: 'Hello, Willa! You have 8 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824bacdb6e36c338da723',
      index: 12,
      guid: 'f69d529d-2afe-4442-9c5d-79486401bacb',
      isActive: false,
      balance: '$1,036.01',
      picture: 'http://placehold.it/32x32',
      age: 20,
      eyeColor: 'green',
      name: { first: 'Sophia', last: 'Hood' },
      company: 'KIDSTOCK',
      email: 'sophia.hood@kidstock.me',
      phone: '+1 (923) 476-2250',
      address: '374 Branton Street, Echo, Alaska, 1085',
      about: '',
      registered: 'Tuesday, April 21, 2015 1:37 PM',
      latitude: '-65.427707',
      longitude: '-99.56509',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Charlene Orr' },
        { id: 1, name: 'Gomez Mills' },
        { id: 2, name: 'Williamson Hanson' }
      ],
      greeting: 'Hello, Sophia! You have 8 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba089a992118e35d95',
      index: 84,
      guid: '97da3b65-1e8e-4774-91a7-531c75893342',
      isActive: true,
      balance: '$2,008.09',
      picture: 'http://placehold.it/32x32',
      age: 34,
      eyeColor: 'brown',
      name: { first: 'Katelyn', last: 'Ford' },
      company: 'HATOLOGY',
      email: 'katelyn.ford@hatology.me',
      phone: '+1 (842) 485-2276',
      address: '927 Tennis Court, Jackpot, New Jersey, 9367',
      about: '',
      registered: 'Saturday, February 17, 2018 11:14 AM',
      latitude: '69.04944',
      longitude: '138.817408',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Vicky Walter' },
        { id: 1, name: 'Curtis Logan' },
        { id: 2, name: 'Cortez Gilbert' }
      ],
      greeting: 'Hello, Katelyn! You have 5 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824bac5a7bc1e891f9e01',
      index: 35,
      guid: 'ca000a4d-355b-4bd7-9304-3ce9e53a3a35',
      isActive: true,
      balance: '$1,837.33',
      picture: 'http://placehold.it/32x32',
      age: 22,
      eyeColor: 'green',
      name: { first: 'Kirsten', last: 'Pena' },
      company: 'LIQUICOM',
      email: 'kirsten.pena@liquicom.biz',
      phone: '+1 (891) 467-3255',
      address: '972 Emerald Street, Sunnyside, Florida, 618',
      about: '',
      registered: 'Sunday, September 21, 2014 11:01 PM',
      latitude: '37.1833',
      longitude: '-64.364491',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Earline Dixon' },
        { id: 1, name: 'Cox Montoya' },
        { id: 2, name: 'Mccarthy Crawford' }
      ],
      greeting: 'Hello, Kirsten! You have 10 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba2ae0960d92b2e620',
      index: 25,
      guid: 'eb2ca0dc-b9b6-4b29-a1ef-7d5188936350',
      isActive: true,
      balance: '$2,127.37',
      picture: 'http://placehold.it/32x32',
      age: 34,
      eyeColor: 'green',
      name: { first: 'Buchanan', last: 'Townsend' },
      company: 'VOLAX',
      email: 'buchanan.townsend@volax.net',
      phone: '+1 (821) 551-2627',
      address: '524 Rapelye Street, Fannett, Delaware, 1579',
      about: '',
      registered: 'Monday, September 9, 2019 5:27 PM',
      latitude: '-87.262566',
      longitude: '-36.128528',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Whitehead Tyson' },
        { id: 1, name: 'Lacy Schneider' },
        { id: 2, name: 'Rogers Gomez' }
      ],
      greeting: 'Hello, Buchanan! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bab82d897ccbcc9ab9',
      index: 30,
      guid: '9206180c-ef01-4d47-896e-81b2e70175ba',
      isActive: true,
      balance: '$1,690.82',
      picture: 'http://placehold.it/32x32',
      age: 30,
      eyeColor: 'green',
      name: { first: 'Skinner', last: 'Burnett' },
      company: 'RODEOCEAN',
      email: 'skinner.burnett@rodeocean.info',
      phone: '+1 (974) 538-3171',
      address: '485 Barbey Street, Riegelwood, Oregon, 549',
      about: '',
      registered: 'Monday, July 16, 2018 1:38 PM',
      latitude: '76.771302',
      longitude: '-0.525037',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Madge Cooley' },
        { id: 1, name: 'Osborn Welch' },
        { id: 2, name: 'Melendez Sullivan' }
      ],
      greeting: 'Hello, Skinner! You have 5 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba5f3c60ce52a4ba52',
      index: 73,
      guid: 'f7fb2f7b-0475-4412-923b-bfdee010c2cd',
      isActive: false,
      balance: '$2,373.43',
      picture: 'http://placehold.it/32x32',
      age: 40,
      eyeColor: 'brown',
      name: { first: 'Sweeney', last: 'Russell' },
      company: 'GLOBOIL',
      email: 'sweeney.russell@globoil.net',
      phone: '+1 (996) 464-2726',
      address: '574 Poplar Street, Detroit, District Of Columbia, 143',
      about: '',
      registered: 'Sunday, March 12, 2017 12:27 AM',
      latitude: '41.213702',
      longitude: '-162.613531',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Olive Ferguson' },
        { id: 1, name: 'Barber Delaney' },
        { id: 2, name: 'Joanne Chandler' }
      ],
      greeting: 'Hello, Sweeney! You have 5 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba1bc4e25ed8a3ea57',
      index: 44,
      guid: '973abbbd-621d-49a6-ad0b-20486f1955ab',
      isActive: false,
      balance: '$2,376.31',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'blue',
      name: { first: 'Mcdowell', last: 'Grant' },
      company: 'SHADEASE',
      email: 'mcdowell.grant@shadease.ca',
      phone: '+1 (849) 446-3434',
      address: '436 Miller Avenue, Indio, Rhode Island, 6076',
      about: '',
      registered: 'Saturday, September 1, 2018 1:14 PM',
      latitude: '85.726827',
      longitude: '-24.31095',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Emerson Weber' },
        { id: 1, name: 'Charity Lindsey' },
        { id: 2, name: 'Conley Mcconnell' }
      ],
      greeting: 'Hello, Mcdowell! You have 7 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba1452ed5a00041ca0',
      index: 77,
      guid: '5e52674a-6825-4c4f-9cda-9c66af05ea72',
      isActive: false,
      balance: '$3,535.29',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'brown',
      name: { first: 'Merritt', last: 'Patton' },
      company: 'XIIX',
      email: 'merritt.patton@xiix.tv',
      phone: '+1 (859) 596-3982',
      address: '517 Windsor Place, Sedley, Maryland, 9405',
      about: '',
      registered: 'Monday, November 10, 2014 6:30 AM',
      latitude: '-30.002695',
      longitude: '7.412567',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Hester Pope' },
        { id: 1, name: 'Serrano Bell' },
        { id: 2, name: 'Kristen Battle' }
      ],
      greeting: 'Hello, Merritt! You have 7 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba878f3c8959f9bb90',
      index: 54,
      guid: '1fef8d48-6953-41b2-b202-aee2d2cbdcdb',
      isActive: false,
      balance: '$3,904.55',
      picture: 'http://placehold.it/32x32',
      age: 35,
      eyeColor: 'brown',
      name: { first: 'Reese', last: 'Mendez' },
      company: 'HOTCAKES',
      email: 'reese.mendez@hotcakes.info',
      phone: '+1 (858) 545-2227',
      address: '855 Turnbull Avenue, Graniteville, North Carolina, 3719',
      about: '',
      registered: 'Thursday, December 22, 2016 6:29 PM',
      latitude: '-75.511351',
      longitude: '173.723905',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Mejia Kaufman' },
        { id: 1, name: 'Chavez Kerr' },
        { id: 2, name: 'Lori Moore' }
      ],
      greeting: 'Hello, Reese! You have 10 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824bae7129dc646ad87d7',
      index: 2,
      guid: '9cb285d6-6bbe-44be-97e3-f0c1c6cad046',
      isActive: false,
      balance: '$2,679.49',
      picture: 'http://placehold.it/32x32',
      age: 30,
      eyeColor: 'brown',
      name: { first: 'Mason', last: 'Oneill' },
      company: 'PORTICA',
      email: 'mason.oneill@portica.name',
      phone: '+1 (844) 400-2362',
      address: '412 Nevins Street, Riner, California, 6283',
      about: '',
      registered: 'Friday, May 2, 2014 2:44 AM',
      latitude: '85.557218',
      longitude: '-67.734162',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Ingrid Carter' },
        { id: 1, name: 'Alejandra Carpenter' },
        { id: 2, name: 'Kenya Tucker' }
      ],
      greeting: 'Hello, Mason! You have 8 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba099e00489d58771a',
      index: 61,
      guid: 'bd0c7bd2-0df9-40fc-9b3f-1311179c2119',
      isActive: false,
      balance: '$3,781.17',
      picture: 'http://placehold.it/32x32',
      age: 39,
      eyeColor: 'blue',
      name: { first: 'Dianne', last: 'Larson' },
      company: 'QUANTALIA',
      email: 'dianne.larson@quantalia.net',
      phone: '+1 (804) 580-2560',
      address: '760 Elmwood Avenue, Caroleen, Marshall Islands, 8988',
      about: '',
      registered: 'Friday, May 23, 2014 10:50 PM',
      latitude: '-39.640987',
      longitude: '99.490216',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Booker Harper' },
        { id: 1, name: 'Avery Baird' },
        { id: 2, name: 'Sanchez Pittman' }
      ],
      greeting: 'Hello, Dianne! You have 8 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824baab6c09a8b344fc0e',
      index: 97,
      guid: '5cc36dbb-3d98-46fd-8869-07b3b7c59096',
      isActive: true,
      balance: '$1,627.01',
      picture: 'http://placehold.it/32x32',
      age: 30,
      eyeColor: 'green',
      name: { first: 'Stanley', last: 'Mckay' },
      company: 'HAIRPORT',
      email: 'stanley.mckay@hairport.net',
      phone: '+1 (888) 464-3474',
      address: '683 Plymouth Street, Lacomb, Montana, 6742',
      about: '',
      registered: 'Monday, January 27, 2014 6:50 AM',
      latitude: '74.567674',
      longitude: '-5.408377',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Dotson Everett' },
        { id: 1, name: 'Sharp Boyer' },
        { id: 2, name: 'Hendrix Adams' }
      ],
      greeting: 'Hello, Stanley! You have 5 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba332b214f95797af0',
      index: 99,
      guid: '415ae3c1-6340-444c-bb74-aacef1df9a78',
      isActive: false,
      balance: '$2,893.29',
      picture: 'http://placehold.it/32x32',
      age: 39,
      eyeColor: 'blue',
      name: { first: 'Bowman', last: 'Velasquez' },
      company: 'ORBAXTER',
      email: 'bowman.velasquez@orbaxter.org',
      phone: '+1 (822) 450-3493',
      address: '647 Nelson Street, Robbins, Kentucky, 8317',
      about: '',
      registered: 'Monday, February 24, 2014 4:30 AM',
      latitude: '63.166782',
      longitude: '136.333769',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Morse Buchanan' },
        { id: 1, name: 'Kerr Dickson' },
        { id: 2, name: 'Jasmine Whitney' }
      ],
      greeting: 'Hello, Bowman! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bac54d101248f1141d',
      index: 96,
      guid: '006bc1bf-90f7-4594-b6a0-a724f0447259',
      isActive: false,
      balance: '$2,375.58',
      picture: 'http://placehold.it/32x32',
      age: 20,
      eyeColor: 'green',
      name: { first: 'Glenda', last: 'Davenport' },
      company: 'ZYTREX',
      email: 'glenda.davenport@zytrex.me',
      phone: '+1 (904) 466-2061',
      address: '740 Wilson Street, Brownlee, Virgin Islands, 7136',
      about: '',
      registered: 'Tuesday, January 24, 2017 3:40 PM',
      latitude: '-42.370717',
      longitude: '-95.891441',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Howell Richard' },
        { id: 1, name: 'Knox Zamora' },
        { id: 2, name: 'Isabella Powers' }
      ],
      greeting: 'Hello, Glenda! You have 5 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba7247c947f1adf59a',
      index: 15,
      guid: '09aab09a-f121-4e35-b72e-0c433ad03428',
      isActive: true,
      balance: '$1,931.24',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'brown',
      name: { first: 'Goldie', last: 'Howell' },
      company: 'CEDWARD',
      email: 'goldie.howell@cedward.org',
      phone: '+1 (953) 465-2574',
      address: '428 Howard Place, Basye, District Of Columbia, 9078',
      about: '',
      registered: 'Tuesday, May 26, 2015 10:16 PM',
      latitude: '74.723798',
      longitude: '1.321527',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Martha Wells' },
        { id: 1, name: 'Latoya Brennan' },
        { id: 2, name: 'Margie Espinoza' }
      ],
      greeting: 'Hello, Goldie! You have 6 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824baa202802657a8617f',
      index: 6,
      guid: 'f9382baf-d88c-4e84-8412-fb16004ede21',
      isActive: true,
      balance: '$3,220.02',
      picture: 'http://placehold.it/32x32',
      age: 24,
      eyeColor: 'green',
      name: { first: 'Delaney', last: 'Wiley' },
      company: 'PANZENT',
      email: 'delaney.wiley@panzent.info',
      phone: '+1 (801) 505-3820',
      address: '379 Mill Avenue, Sharon, Georgia, 1546',
      about: '',
      registered: 'Saturday, April 25, 2015 4:26 PM',
      latitude: '27.826274',
      longitude: '-85.279794',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Lloyd Bright' },
        { id: 1, name: 'Sampson Saunders' },
        { id: 2, name: 'Carmela Washington' }
      ],
      greeting: 'Hello, Delaney! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824baa726f42277dcc13d',
      index: 52,
      guid: 'dd3401d6-c2d0-4718-9c0b-339d03c11d65',
      isActive: true,
      balance: '$3,785.25',
      picture: 'http://placehold.it/32x32',
      age: 20,
      eyeColor: 'green',
      name: { first: 'Francisca', last: 'Le' },
      company: 'RETRACK',
      email: 'francisca.le@retrack.us',
      phone: '+1 (881) 416-3616',
      address: '234 Channel Avenue, Hatteras, Idaho, 210',
      about: '',
      registered: 'Thursday, December 12, 2019 4:45 AM',
      latitude: '-25.983534',
      longitude: '66.652977',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Hope Wright' },
        { id: 1, name: 'Ramona Dodson' },
        { id: 2, name: 'Callie Buckley' }
      ],
      greeting: 'Hello, Francisca! You have 7 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba51f0d4e3e6034d55',
      index: 0,
      guid: 'a320c633-7ac7-46be-959a-2b740a0503e2',
      isActive: true,
      balance: '$2,180.28',
      picture: 'http://placehold.it/32x32',
      age: 20,
      eyeColor: 'green',
      name: { first: 'Farrell', last: 'Vance' },
      company: 'ENJOLA',
      email: 'farrell.vance@enjola.me',
      phone: '+1 (986) 481-2585',
      address: '957 Trucklemans Lane, Dotsero, North Dakota, 7406',
      about: '',
      registered: 'Saturday, June 24, 2017 2:09 AM',
      latitude: '40.938747',
      longitude: '70.737213',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Kara Puckett' },
        { id: 1, name: 'Levy Trujillo' },
        { id: 2, name: 'Naomi Moses' }
      ],
      greeting: 'Hello, Farrell! You have 7 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba9f98d884033ab3a7',
      index: 41,
      guid: 'b4433911-f3e3-41d9-8296-a6702c04f6d5',
      isActive: true,
      balance: '$3,146.63',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'blue',
      name: { first: 'Leon', last: 'Ochoa' },
      company: 'TECHTRIX',
      email: 'leon.ochoa@techtrix.tv',
      phone: '+1 (973) 468-2816',
      address: '950 Grimes Road, Hachita, Kentucky, 6272',
      about: '',
      registered: 'Wednesday, March 9, 2016 2:26 PM',
      latitude: '3.611673',
      longitude: '137.474208',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Pena Foreman' },
        { id: 1, name: 'Vang Rhodes' },
        { id: 2, name: 'Liz Lowe' }
      ],
      greeting: 'Hello, Leon! You have 7 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba41411aad784f8c9e',
      index: 69,
      guid: 'febccea6-9110-4a51-9974-2c4ed24c7db6',
      isActive: true,
      balance: '$3,183.91',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'green',
      name: { first: 'Anastasia', last: 'Nash' },
      company: 'POLARIUM',
      email: 'anastasia.nash@polarium.biz',
      phone: '+1 (879) 522-3100',
      address: '217 Rochester Avenue, Edinburg, Colorado, 1558',
      about: '',
      registered: 'Sunday, November 24, 2019 1:30 AM',
      latitude: '-86.322506',
      longitude: '-142.269515',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Rodgers Benton' },
        { id: 1, name: 'Meagan Rios' },
        { id: 2, name: 'Sellers Thornton' }
      ],
      greeting: 'Hello, Anastasia! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba7da4aba18a68b60f',
      index: 1,
      guid: '097c6427-bd67-46f7-8d58-439538e75f01',
      isActive: false,
      balance: '$1,113.55',
      picture: 'http://placehold.it/32x32',
      age: 35,
      eyeColor: 'green',
      name: { first: 'Peterson', last: 'Chase' },
      company: 'QIMONK',
      email: 'peterson.chase@qimonk.net',
      phone: '+1 (948) 452-2395',
      address: '562 Commercial Street, Dale, New Hampshire, 8699',
      about: '',
      registered: 'Thursday, March 23, 2017 5:43 AM',
      latitude: '-73.324696',
      longitude: '161.139967',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Branch Jordan' },
        { id: 1, name: 'Gilbert Small' },
        { id: 2, name: 'Baxter Buckner' }
      ],
      greeting: 'Hello, Peterson! You have 10 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba46239002f0c2bb86',
      index: 48,
      guid: '348592b6-2291-4d4d-be56-21835d973b08',
      isActive: true,
      balance: '$2,413.31',
      picture: 'http://placehold.it/32x32',
      age: 29,
      eyeColor: 'blue',
      name: { first: 'Clay', last: 'Blackburn' },
      company: 'UNIA',
      email: 'clay.blackburn@unia.me',
      phone: '+1 (982) 545-2766',
      address: '889 Losee Terrace, Coleville, Ohio, 551',
      about: '',
      registered: 'Tuesday, March 5, 2019 3:24 AM',
      latitude: '48.161401',
      longitude: '-71.379499',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Erica Lowery' },
        { id: 1, name: 'Ray Hatfield' },
        { id: 2, name: 'Wright Jacobs' }
      ],
      greeting: 'Hello, Clay! You have 6 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba83425f383982ddd5',
      index: 29,
      guid: '470386fe-42b0-43bf-b877-e30b115b4a91',
      isActive: false,
      balance: '$2,568.71',
      picture: 'http://placehold.it/32x32',
      age: 33,
      eyeColor: 'green',
      name: { first: 'Beach', last: 'Allen' },
      company: 'VIAGREAT',
      email: 'beach.allen@viagreat.tv',
      phone: '+1 (984) 431-3857',
      address: '166 Bond Street, Jacumba, New York, 7308',
      about: '',
      registered: 'Sunday, June 23, 2019 6:38 AM',
      latitude: '-44.781989',
      longitude: '-69.687608',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Whitaker Smith' },
        { id: 1, name: 'Webb Duncan' },
        { id: 2, name: 'Tonya French' }
      ],
      greeting: 'Hello, Beach! You have 8 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824bac8ac35d25e7cf453',
      index: 90,
      guid: 'c80780fa-896a-4eb9-b5f5-262d10c16536',
      isActive: true,
      balance: '$1,249.40',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'brown',
      name: { first: 'Faye', last: 'Bridges' },
      company: 'HARMONEY',
      email: 'faye.bridges@harmoney.info',
      phone: '+1 (930) 475-2035',
      address: '554 Tompkins Avenue, Deltaville, Michigan, 6207',
      about: '',
      registered: 'Sunday, July 3, 2016 11:19 PM',
      latitude: '7.105155',
      longitude: '101.14613',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Sue Henson' },
        { id: 1, name: 'Celina Holloway' },
        { id: 2, name: 'Ayers Payne' }
      ],
      greeting: 'Hello, Faye! You have 8 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba92b1b18b14c7f7da',
      index: 88,
      guid: 'c035181a-8993-418f-8dda-a1af23fb1922',
      isActive: true,
      balance: '$1,453.00',
      picture: 'http://placehold.it/32x32',
      age: 31,
      eyeColor: 'blue',
      name: { first: 'Juanita', last: 'Holmes' },
      company: 'INTERFIND',
      email: 'juanita.holmes@interfind.us',
      phone: '+1 (964) 506-3331',
      address: '780 Howard Avenue, Sutton, Oregon, 7563',
      about: '',
      registered: 'Wednesday, May 3, 2017 3:34 PM',
      latitude: '46.053807',
      longitude: '-105.338718',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Coffey Dalton' },
        { id: 1, name: 'Fuller Edwards' },
        { id: 2, name: 'Mccullough Swanson' }
      ],
      greeting: 'Hello, Juanita! You have 9 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba6594c6785169c664',
      index: 21,
      guid: 'c2d477fa-f890-46c2-bed4-59248658749c',
      isActive: true,
      balance: '$3,337.04',
      picture: 'http://placehold.it/32x32',
      age: 34,
      eyeColor: 'brown',
      name: { first: 'Judith', last: 'Pacheco' },
      company: 'FURNAFIX',
      email: 'judith.pacheco@furnafix.biz',
      phone: '+1 (871) 469-3408',
      address: '290 Emerson Place, Blodgett, Wyoming, 2536',
      about: '',
      registered: 'Saturday, June 7, 2014 11:16 PM',
      latitude: '-37.768306',
      longitude: '-133.456163',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Morton House' },
        { id: 1, name: 'Mia Chapman' },
        { id: 2, name: 'Ross Hester' }
      ],
      greeting: 'Hello, Judith! You have 7 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba395c1a98e0cb5b9c',
      index: 43,
      guid: 'ed27d802-6aeb-4b29-8b80-47e5e37c0f58',
      isActive: false,
      balance: '$1,154.65',
      picture: 'http://placehold.it/32x32',
      age: 25,
      eyeColor: 'brown',
      name: { first: 'Dunlap', last: 'Flowers' },
      company: 'ENAUT',
      email: 'dunlap.flowers@enaut.co.uk',
      phone: '+1 (834) 577-3172',
      address: '418 Arion Place, Gorst, Pennsylvania, 7360',
      about: '',
      registered: 'Tuesday, October 11, 2016 8:57 AM',
      latitude: '18.055748',
      longitude: '-143.220983',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Sharpe Robertson' },
        { id: 1, name: 'Jillian Gordon' },
        { id: 2, name: 'Gwendolyn Huber' }
      ],
      greeting: 'Hello, Dunlap! You have 10 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba9a963dfa54d3fc7f',
      index: 56,
      guid: '7b1fd2ab-d9d4-4384-9034-245602055224',
      isActive: false,
      balance: '$1,434.36',
      picture: 'http://placehold.it/32x32',
      age: 35,
      eyeColor: 'brown',
      name: { first: 'Holman', last: 'Mays' },
      company: 'ZILLAN',
      email: 'holman.mays@zillan.ca',
      phone: '+1 (815) 555-2681',
      address: '747 Falmouth Street, Stonybrook, Massachusetts, 1884',
      about: '',
      registered: 'Saturday, April 13, 2019 5:46 AM',
      latitude: '-75.022475',
      longitude: '126.608917',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Roy Farley' },
        { id: 1, name: 'Clare Burks' },
        { id: 2, name: 'Hunter Weaver' }
      ],
      greeting: 'Hello, Holman! You have 6 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba0f2432191ae18a82',
      index: 8,
      guid: 'd031f3da-4cd6-45a9-a4bd-d9b94863b27c',
      isActive: false,
      balance: '$1,722.81',
      picture: 'http://placehold.it/32x32',
      age: 20,
      eyeColor: 'blue',
      name: { first: 'Carol', last: 'Hewitt' },
      company: 'MEGALL',
      email: 'carol.hewitt@megall.ca',
      phone: '+1 (944) 448-3497',
      address: '679 Chester Avenue, Garfield, West Virginia, 7480',
      about: '',
      registered: 'Thursday, December 25, 2014 7:06 AM',
      latitude: '-5.605966',
      longitude: '-59.883776',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Tamara Graves' },
        { id: 1, name: 'Geneva Mosley' },
        { id: 2, name: 'Morrison Bates' }
      ],
      greeting: 'Hello, Carol! You have 7 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824baa364c58587515e12',
      index: 49,
      guid: '1f56eefa-c331-46ec-b004-441346339050',
      isActive: false,
      balance: '$3,398.87',
      picture: 'http://placehold.it/32x32',
      age: 40,
      eyeColor: 'brown',
      name: { first: 'Herminia', last: 'Chaney' },
      company: 'ISOSTREAM',
      email: 'herminia.chaney@isostream.net',
      phone: '+1 (882) 562-3359',
      address: '803 Elliott Walk, Worton, Mississippi, 9258',
      about: '',
      registered: 'Thursday, May 23, 2019 9:46 AM',
      latitude: '-17.845288',
      longitude: '64.585127',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Kelli Melton' },
        { id: 1, name: 'Lena Sosa' },
        { id: 2, name: 'Reba Durham' }
      ],
      greeting: 'Hello, Herminia! You have 5 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bae1e3b4a93c2557cf',
      index: 67,
      guid: '3053dcb5-41d7-4f1c-8565-c5dad031f08c',
      isActive: false,
      balance: '$2,666.78',
      picture: 'http://placehold.it/32x32',
      age: 39,
      eyeColor: 'brown',
      name: { first: 'Nola', last: 'Rodriquez' },
      company: 'SLAMBDA',
      email: 'nola.rodriquez@slambda.co.uk',
      phone: '+1 (925) 579-2566',
      address: '945 Jackson Street, Norfolk, Guam, 7407',
      about: '',
      registered: 'Saturday, April 19, 2014 4:14 AM',
      latitude: '9.198385',
      longitude: '167.183014',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Della Berry' },
        { id: 1, name: 'Maxwell Delacruz' },
        { id: 2, name: 'Mildred Velazquez' }
      ],
      greeting: 'Hello, Nola! You have 5 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba33552eb0ad31ba74',
      index: 58,
      guid: 'edab73af-2d78-4a7c-a2c5-173725095c58',
      isActive: true,
      balance: '$3,983.00',
      picture: 'http://placehold.it/32x32',
      age: 22,
      eyeColor: 'blue',
      name: { first: 'Obrien', last: 'Hurst' },
      company: 'ROBOID',
      email: 'obrien.hurst@roboid.io',
      phone: '+1 (904) 404-2391',
      address: '113 Herzl Street, Cobbtown, North Dakota, 9249',
      about: '',
      registered: 'Wednesday, December 20, 2017 9:12 PM',
      latitude: '-30.006375',
      longitude: '-173.035857',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Holt Soto' },
        { id: 1, name: 'Addie Fry' },
        { id: 2, name: 'Carey Hughes' }
      ],
      greeting: 'Hello, Obrien! You have 9 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba7777d32232daf693',
      index: 33,
      guid: 'd17c5396-1221-4faa-82ed-600e259fae10',
      isActive: true,
      balance: '$1,455.26',
      picture: 'http://placehold.it/32x32',
      age: 25,
      eyeColor: 'brown',
      name: { first: 'Hunt', last: 'Buck' },
      company: 'NSPIRE',
      email: 'hunt.buck@nspire.biz',
      phone: '+1 (960) 539-3971',
      address: '688 Seabring Street, Brookfield, Utah, 7973',
      about: '',
      registered: 'Wednesday, September 26, 2018 9:10 AM',
      latitude: '55.079304',
      longitude: '-120.405647',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Ashley Porter' },
        { id: 1, name: 'Molina Webster' },
        { id: 2, name: 'Barron Hartman' }
      ],
      greeting: 'Hello, Hunt! You have 7 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba413f8ffe024dd832',
      index: 95,
      guid: '030c5309-904b-42d3-9798-2e72f115bfef',
      isActive: false,
      balance: '$2,213.57',
      picture: 'http://placehold.it/32x32',
      age: 40,
      eyeColor: 'brown',
      name: { first: 'Linda', last: 'Bush' },
      company: 'ACCUFARM',
      email: 'linda.bush@accufarm.biz',
      phone: '+1 (884) 493-3275',
      address: '711 Hinsdale Street, Gerber, Texas, 6276',
      about: '',
      registered: 'Sunday, October 21, 2018 8:05 AM',
      latitude: '53.998809',
      longitude: '20.044493',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Stein Monroe' },
        { id: 1, name: 'Marcella Alexander' },
        { id: 2, name: 'Shawna Mcfadden' }
      ],
      greeting: 'Hello, Linda! You have 7 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba5cd25e28f380b69f',
      index: 87,
      guid: '1c07225b-5218-4779-8373-78f54f9967d1',
      isActive: true,
      balance: '$3,542.33',
      picture: 'http://placehold.it/32x32',
      age: 33,
      eyeColor: 'blue',
      name: { first: 'Wilson', last: 'Dawson' },
      company: 'BLANET',
      email: 'wilson.dawson@blanet.org',
      phone: '+1 (800) 402-3349',
      address: '481 Verona Street, Fontanelle, New York, 813',
      about: '',
      registered: 'Monday, February 5, 2018 11:26 PM',
      latitude: '66.189608',
      longitude: '120.686494',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Goff Butler' },
        { id: 1, name: 'Phillips Davidson' },
        { id: 2, name: 'Roxanne Ramos' }
      ],
      greeting: 'Hello, Wilson! You have 8 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bacb815c0f40c0ebf1',
      index: 98,
      guid: '47625e16-f1f1-4186-8227-54f086dfa083',
      isActive: true,
      balance: '$1,925.14',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'brown',
      name: { first: 'Booth', last: 'Collier' },
      company: 'QUARX',
      email: 'booth.collier@quarx.name',
      phone: '+1 (831) 553-3578',
      address: '349 Pioneer Street, Kirk, Washington, 7761',
      about: '',
      registered: 'Sunday, August 7, 2016 6:42 AM',
      latitude: '8.395869',
      longitude: '39.674613',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Payne Richmond' },
        { id: 1, name: 'Mills Vinson' },
        { id: 2, name: 'Schroeder Hansen' }
      ],
      greeting: 'Hello, Booth! You have 6 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bab112d5d4742f1547',
      index: 3,
      guid: '41abe177-0777-4c6b-8aef-be5a8b4df966',
      isActive: false,
      balance: '$2,031.33',
      picture: 'http://placehold.it/32x32',
      age: 35,
      eyeColor: 'brown',
      name: { first: 'Helen', last: 'Woods' },
      company: 'ZINCA',
      email: 'helen.woods@zinca.org',
      phone: '+1 (890) 556-3697',
      address: '970 Harrison Place, Hall, Marshall Islands, 6041',
      about: '',
      registered: 'Tuesday, July 26, 2016 8:35 PM',
      latitude: '53.316671',
      longitude: '171.785171',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Katrina Mccullough' },
        { id: 1, name: 'Haley Larsen' },
        { id: 2, name: 'Dennis Robbins' }
      ],
      greeting: 'Hello, Helen! You have 9 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824baee47ef904665daa9',
      index: 17,
      guid: 'a754b336-3884-4100-a702-d79107a14ae9',
      isActive: false,
      balance: '$1,684.22',
      picture: 'http://placehold.it/32x32',
      age: 20,
      eyeColor: 'green',
      name: { first: 'Oneil', last: 'Maldonado' },
      company: 'DADABASE',
      email: 'oneil.maldonado@dadabase.tv',
      phone: '+1 (905) 415-3581',
      address: '390 Allen Avenue, Tibbie, Hawaii, 4104',
      about: '',
      registered: 'Sunday, February 11, 2018 1:24 PM',
      latitude: '-35.613147',
      longitude: '117.385995',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Jennifer Decker' },
        { id: 1, name: 'Holloway Rosales' },
        { id: 2, name: 'Bonner Poole' }
      ],
      greeting: 'Hello, Oneil! You have 8 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824baee0db383c402d851',
      index: 85,
      guid: '55853fd8-3efa-4a31-b503-0079d4504bd0',
      isActive: true,
      balance: '$1,834.92',
      picture: 'http://placehold.it/32x32',
      age: 31,
      eyeColor: 'green',
      name: { first: 'George', last: 'Ingram' },
      company: 'HIVEDOM',
      email: 'george.ingram@hivedom.net',
      phone: '+1 (825) 543-2146',
      address: '856 Oliver Street, Moscow, Illinois, 2154',
      about: '',
      registered: 'Friday, July 24, 2015 10:42 PM',
      latitude: '-2.975481',
      longitude: '-87.044721',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Sheree Michael' },
        { id: 1, name: 'Hoover Crane' },
        { id: 2, name: 'Ursula Gates' }
      ],
      greeting: 'Hello, George! You have 7 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824babc44f8637bd5f892',
      index: 4,
      guid: '779f04ad-1745-49cb-bdf9-e434568ba4b8',
      isActive: false,
      balance: '$1,447.63',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'blue',
      name: { first: 'Owens', last: 'Leach' },
      company: 'ESCHOIR',
      email: 'owens.leach@eschoir.us',
      phone: '+1 (989) 561-3750',
      address: '396 Glen Street, Cutter, Kansas, 4335',
      about: '',
      registered: 'Saturday, February 21, 2015 3:04 AM',
      latitude: '61.252365',
      longitude: '1.59566',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Joni Duke' },
        { id: 1, name: 'Brock Munoz' },
        { id: 2, name: 'Morgan Joyner' }
      ],
      greeting: 'Hello, Owens! You have 8 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba17ce948ac34cc9d7',
      index: 10,
      guid: 'f3c72f69-b39c-4795-87cf-1d82c37a8938',
      isActive: true,
      balance: '$3,615.70',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'green',
      name: { first: 'Hillary', last: 'Lyons' },
      company: 'HALAP',
      email: 'hillary.lyons@halap.io',
      phone: '+1 (811) 423-3129',
      address: '834 Horace Court, Cleary, South Carolina, 6090',
      about: '',
      registered: 'Sunday, March 18, 2018 4:33 PM',
      latitude: '74.417821',
      longitude: '127.48643',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Rollins Knowles' },
        { id: 1, name: 'Downs Mendoza' },
        { id: 2, name: 'Twila Anderson' }
      ],
      greeting: 'Hello, Hillary! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba6fdd0a0ac774e016',
      index: 55,
      guid: '7293cbaa-ec48-4f41-9d0e-9b4009836a15',
      isActive: true,
      balance: '$1,897.18',
      picture: 'http://placehold.it/32x32',
      age: 27,
      eyeColor: 'brown',
      name: { first: 'Melinda', last: 'Turner' },
      company: 'NIQUENT',
      email: 'melinda.turner@niquent.co.uk',
      phone: '+1 (966) 507-3954',
      address: '356 Cox Place, Hasty, Federated States Of Micronesia, 4778',
      about: '',
      registered: 'Friday, March 29, 2019 6:31 PM',
      latitude: '52.658552',
      longitude: '154.026133',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Mcfarland Fernandez' },
        { id: 1, name: 'Allie Carney' },
        { id: 2, name: 'Valentine Hubbard' }
      ],
      greeting: 'Hello, Melinda! You have 6 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824baff50d68fb6b87727',
      index: 76,
      guid: '7ba0f145-c753-42ba-a88b-ec32306ad16e',
      isActive: false,
      balance: '$1,194.98',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'green',
      name: { first: 'Carter', last: 'Cantu' },
      company: 'MIXERS',
      email: 'carter.cantu@mixers.us',
      phone: '+1 (945) 589-3436',
      address: '366 Furman Avenue, Dunlo, Nebraska, 469',
      about: '',
      registered: 'Friday, February 10, 2017 11:40 PM',
      latitude: '-19.010379',
      longitude: '106.529291',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Kathrine Wilkins' },
        { id: 1, name: 'Allison Morin' },
        { id: 2, name: 'Norris Contreras' }
      ],
      greeting: 'Hello, Carter! You have 9 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba197d979d06c321f8',
      index: 40,
      guid: '785bc8b7-1af6-46b1-97bc-0cc0894ad95c',
      isActive: true,
      balance: '$3,095.33',
      picture: 'http://placehold.it/32x32',
      age: 40,
      eyeColor: 'brown',
      name: { first: 'Ana', last: 'Newton' },
      company: 'CINCYR',
      email: 'ana.newton@cincyr.us',
      phone: '+1 (947) 496-2098',
      address: '981 Harden Street, Genoa, Washington, 4486',
      about: '',
      registered: 'Tuesday, May 9, 2017 12:39 AM',
      latitude: '-36.227146',
      longitude: '114.023325',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Rachel Bowers' },
        { id: 1, name: 'Letha Booker' },
        { id: 2, name: 'Tia Weeks' }
      ],
      greeting: 'Hello, Ana! You have 7 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba3ccd019103dc729f',
      index: 16,
      guid: '749d1c4e-93b5-4759-8515-abef6b8d9b53',
      isActive: false,
      balance: '$3,974.46',
      picture: 'http://placehold.it/32x32',
      age: 36,
      eyeColor: 'brown',
      name: { first: 'Savannah', last: 'Simon' },
      company: 'QUILK',
      email: 'savannah.simon@quilk.us',
      phone: '+1 (936) 527-3181',
      address: '642 Caton Avenue, Hinsdale, Vermont, 2969',
      about: '',
      registered: 'Monday, July 21, 2014 2:12 AM',
      latitude: '39.476104',
      longitude: '-128.810642',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Michael Vega' },
        { id: 1, name: 'Hansen Gamble' },
        { id: 2, name: 'Leola Riggs' }
      ],
      greeting: 'Hello, Savannah! You have 8 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bab5a1daff31392e8a',
      index: 37,
      guid: 'f6b1d163-722f-462c-ac7a-ad40ad0b46da',
      isActive: true,
      balance: '$3,788.07',
      picture: 'http://placehold.it/32x32',
      age: 34,
      eyeColor: 'brown',
      name: { first: 'Flossie', last: 'Bishop' },
      company: 'QUARMONY',
      email: 'flossie.bishop@quarmony.net',
      phone: '+1 (828) 533-3380',
      address: '424 Beekman Place, Vicksburg, Texas, 9430',
      about: '',
      registered: 'Monday, August 29, 2016 10:45 PM',
      latitude: '19.094048',
      longitude: '44.896481',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Singleton Hahn' },
        { id: 1, name: 'Edwina Baldwin' },
        { id: 2, name: 'Alberta Kinney' }
      ],
      greeting: 'Hello, Flossie! You have 10 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba21707aee5437df7e',
      index: 86,
      guid: 'ac628a7d-a4ac-438f-9321-bf3172da81a4',
      isActive: true,
      balance: '$3,848.09',
      picture: 'http://placehold.it/32x32',
      age: 40,
      eyeColor: 'green',
      name: { first: 'Newton', last: 'Simmons' },
      company: 'NAXDIS',
      email: 'newton.simmons@naxdis.name',
      phone: '+1 (968) 543-3587',
      address: '726 Hunts Lane, Harrison, Indiana, 7570',
      about: '',
      registered: 'Tuesday, September 2, 2014 4:09 PM',
      latitude: '60.415095',
      longitude: '87.00202',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Robbins Mayer' },
        { id: 1, name: 'Crystal Cohen' },
        { id: 2, name: 'Nichols Carson' }
      ],
      greeting: 'Hello, Newton! You have 10 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824baee1d6ad5a96dd950',
      index: 22,
      guid: '51aac9d5-3873-4dd8-8216-8dde9f9c873e',
      isActive: false,
      balance: '$2,666.35',
      picture: 'http://placehold.it/32x32',
      age: 32,
      eyeColor: 'blue',
      name: { first: 'Mcpherson', last: 'Bauer' },
      company: 'NETPLODE',
      email: 'mcpherson.bauer@netplode.io',
      phone: '+1 (932) 552-2481',
      address: '362 Clymer Street, Ballico, Wisconsin, 8681',
      about: '',
      registered: 'Wednesday, September 27, 2017 10:31 PM',
      latitude: '-42.583922',
      longitude: '-107.435929',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Petersen Dunlap' },
        { id: 1, name: 'Dixie Potter' },
        { id: 2, name: 'Hale Vazquez' }
      ],
      greeting: 'Hello, Mcpherson! You have 10 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824baac3079a04d27adac',
      index: 46,
      guid: '9997fc47-1a06-424a-8729-7e5a63760753',
      isActive: true,
      balance: '$3,109.62',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'green',
      name: { first: 'Polly', last: 'Burgess' },
      company: 'TASMANIA',
      email: 'polly.burgess@tasmania.io',
      phone: '+1 (869) 504-2109',
      address:
        '704 Doughty Street, Westmoreland, Northern Mariana Islands, 8087',
      about: '',
      registered: 'Thursday, April 28, 2016 1:52 PM',
      latitude: '56.846336',
      longitude: '-25.801134',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Marianne Goodman' },
        { id: 1, name: 'Hancock Watson' },
        { id: 2, name: 'Eleanor Manning' }
      ],
      greeting: 'Hello, Polly! You have 10 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824baf5e545589be6693d',
      index: 39,
      guid: '527101b8-0d90-42aa-bf37-c4a983278043',
      isActive: false,
      balance: '$3,107.45',
      picture: 'http://placehold.it/32x32',
      age: 22,
      eyeColor: 'green',
      name: { first: 'Hickman', last: 'King' },
      company: 'MATRIXITY',
      email: 'hickman.king@matrixity.org',
      phone: '+1 (991) 490-2621',
      address: '907 Leonard Street, Bangor, Montana, 9877',
      about: '',
      registered: 'Thursday, April 17, 2014 5:55 PM',
      latitude: '-17.326055',
      longitude: '34.924408',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Bruce Greene' },
        { id: 1, name: 'Frances Camacho' },
        { id: 2, name: 'Dionne Garza' }
      ],
      greeting: 'Hello, Hickman! You have 5 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824babaca67761750ac2b',
      index: 13,
      guid: '864305b6-0ff8-4a7d-aeaa-f0057ea30963',
      isActive: true,
      balance: '$1,505.25',
      picture: 'http://placehold.it/32x32',
      age: 22,
      eyeColor: 'green',
      name: { first: 'Richmond', last: 'Thompson' },
      company: 'ACCUPHARM',
      email: 'richmond.thompson@accupharm.net',
      phone: '+1 (954) 506-2295',
      address: '556 Amber Street, Malott, Palau, 6473',
      about: '',
      registered: 'Tuesday, January 8, 2019 5:55 AM',
      latitude: '45.33396',
      longitude: '57.429947',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Navarro Beach' },
        { id: 1, name: 'Rosie Slater' },
        { id: 2, name: 'Boyle Dillard' }
      ],
      greeting: 'Hello, Richmond! You have 10 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824baf9a83415687e9444',
      index: 81,
      guid: '2107c6df-b583-4a99-8f6d-a34156718ad6',
      isActive: false,
      balance: '$2,923.05',
      picture: 'http://placehold.it/32x32',
      age: 23,
      eyeColor: 'blue',
      name: { first: 'Villarreal', last: 'Bradford' },
      company: 'ZAPPIX',
      email: 'villarreal.bradford@zappix.biz',
      phone: '+1 (963) 592-3601',
      address: '520 Jewel Street, Chestnut, Missouri, 2185',
      about: '',
      registered: 'Wednesday, September 6, 2017 6:54 PM',
      latitude: '32.166922',
      longitude: '42.556896',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Carole Sandoval' },
        { id: 1, name: 'Delores William' },
        { id: 2, name: 'Albert Kirk' }
      ],
      greeting: 'Hello, Villarreal! You have 5 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba7006369c2e6bbac4',
      index: 65,
      guid: 'b1e39ffa-1883-4175-9399-15c1d356e490',
      isActive: true,
      balance: '$1,962.32',
      picture: 'http://placehold.it/32x32',
      age: 25,
      eyeColor: 'green',
      name: { first: 'Rivera', last: 'Ellis' },
      company: 'CALLFLEX',
      email: 'rivera.ellis@callflex.tv',
      phone: '+1 (986) 564-2730',
      address: '922 Drew Street, Wollochet, Minnesota, 1439',
      about: '',
      registered: 'Saturday, November 5, 2016 3:49 AM',
      latitude: '-60.835869',
      longitude: '-173.013658',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Malone Norris' },
        { id: 1, name: 'Shelly Hall' },
        { id: 2, name: 'Rosella Johnson' }
      ],
      greeting: 'Hello, Rivera! You have 10 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824bacb76173384bf1f80',
      index: 91,
      guid: '8c0999c0-b85d-465b-9f3c-c56e9bacbb72',
      isActive: true,
      balance: '$2,532.96',
      picture: 'http://placehold.it/32x32',
      age: 24,
      eyeColor: 'blue',
      name: { first: 'Bridgette', last: 'Mcfarland' },
      company: 'SNORUS',
      email: 'bridgette.mcfarland@snorus.co.uk',
      phone: '+1 (964) 580-2595',
      address: '360 Ash Street, Drummond, Utah, 9100',
      about: '',
      registered: 'Friday, June 16, 2017 5:45 AM',
      latitude: '70.582572',
      longitude: '61.39166',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Dianna Stark' },
        { id: 1, name: 'Martin Haney' },
        { id: 2, name: 'Rosemary Hodges' }
      ],
      greeting: 'Hello, Bridgette! You have 10 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba915cf0bf876cf236',
      index: 42,
      guid: 'c55b4f68-4ea0-440c-83e8-97c5228e8fc5',
      isActive: false,
      balance: '$1,953.33',
      picture: 'http://placehold.it/32x32',
      age: 33,
      eyeColor: 'brown',
      name: { first: 'Meadows', last: 'Ryan' },
      company: 'ISOLOGICS',
      email: 'meadows.ryan@isologics.info',
      phone: '+1 (897) 564-2106',
      address: '158 Pershing Loop, Concho, Maine, 2138',
      about: '',
      registered: 'Tuesday, March 19, 2019 1:25 PM',
      latitude: '30.518453',
      longitude: '-167.290184',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Ford Perry' },
        { id: 1, name: 'Petty Hinton' },
        { id: 2, name: 'Wendy Benjamin' }
      ],
      greeting: 'Hello, Meadows! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824baadce295da0f01a2c',
      index: 47,
      guid: '708b9e56-ae58-461d-ab03-99b9d3efaa49',
      isActive: false,
      balance: '$1,109.24',
      picture: 'http://placehold.it/32x32',
      age: 20,
      eyeColor: 'green',
      name: { first: 'Pitts', last: 'Bryant' },
      company: 'FRANSCENE',
      email: 'pitts.bryant@franscene.biz',
      phone: '+1 (847) 449-3890',
      address: '126 Perry Place, Wakarusa, Alabama, 6477',
      about: '',
      registered: 'Tuesday, March 20, 2018 5:15 PM',
      latitude: '-74.81962',
      longitude: '-103.234005',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Bond Patrick' },
        { id: 1, name: 'Maryanne Macias' },
        { id: 2, name: 'Davenport Cobb' }
      ],
      greeting: 'Hello, Pitts! You have 6 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba66afb78bd64fafcc',
      index: 83,
      guid: 'ef729d71-b64e-44fa-a84f-89c527da06c3',
      isActive: true,
      balance: '$2,806.84',
      picture: 'http://placehold.it/32x32',
      age: 29,
      eyeColor: 'blue',
      name: { first: 'Simone', last: 'Rivers' },
      company: 'OZEAN',
      email: 'simone.rivers@ozean.biz',
      phone: '+1 (963) 464-3957',
      address: '795 Llama Court, Westphalia, Delaware, 4513',
      about: '',
      registered: 'Tuesday, April 18, 2017 2:45 AM',
      latitude: '-46.434622',
      longitude: '-17.89026',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Cleo Moon' },
        { id: 1, name: 'Lilia Thomas' },
        { id: 2, name: 'Marlene Barton' }
      ],
      greeting: 'Hello, Simone! You have 6 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba6c56b4131cb5c486',
      index: 14,
      guid: '9864cd6e-21c1-45ce-bb08-fcac1b269ed7',
      isActive: true,
      balance: '$2,171.55',
      picture: 'http://placehold.it/32x32',
      age: 37,
      eyeColor: 'blue',
      name: { first: 'Sara', last: 'Bean' },
      company: 'VETRON',
      email: 'sara.bean@vetron.name',
      phone: '+1 (972) 469-3664',
      address: '818 Richardson Street, Warren, Arizona, 5992',
      about: '',
      registered: 'Friday, October 18, 2019 5:51 AM',
      latitude: '52.563863',
      longitude: '-48.281103',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Clara Waller' },
        { id: 1, name: 'Salas Pennington' },
        { id: 2, name: 'Wolf Santana' }
      ],
      greeting: 'Hello, Sara! You have 7 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba182e9b3cb53fff00',
      index: 7,
      guid: 'c4dd0bf4-f034-4141-8f3b-6f7f79d94f2c',
      isActive: false,
      balance: '$3,968.12',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'blue',
      name: { first: 'Rosa', last: 'Goff' },
      company: 'MEDICROIX',
      email: 'rosa.goff@medicroix.co.uk',
      phone: '+1 (987) 431-3066',
      address: '584 Robert Street, Harviell, Minnesota, 9061',
      about: '',
      registered: 'Sunday, November 18, 2018 5:22 PM',
      latitude: '-72.658483',
      longitude: '160.905016',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Brewer Knox' },
        { id: 1, name: 'Sandoval Lindsay' },
        { id: 2, name: 'Goodman Gilmore' }
      ],
      greeting: 'Hello, Rosa! You have 10 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824bafcb3e6fc40374eaf',
      index: 11,
      guid: 'f3ba2ecf-c981-45d1-a04f-bf3c984b37bf',
      isActive: true,
      balance: '$1,925.07',
      picture: 'http://placehold.it/32x32',
      age: 32,
      eyeColor: 'green',
      name: { first: 'Mueller', last: 'Bonner' },
      company: 'TROPOLIS',
      email: 'mueller.bonner@tropolis.biz',
      phone: '+1 (885) 553-2111',
      address: '320 Herkimer Street, Navarre, Colorado, 3430',
      about: '',
      registered: 'Friday, July 8, 2016 11:41 PM',
      latitude: '-82.146108',
      longitude: '113.904445',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Wells Schultz' },
        { id: 1, name: 'Santos Valentine' },
        { id: 2, name: 'Beverly Price' }
      ],
      greeting: 'Hello, Mueller! You have 9 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824badfb2d84ea4851552',
      index: 71,
      guid: 'dec76f83-8903-46fe-a04c-9ec9e0eb3eed',
      isActive: false,
      balance: '$2,495.12',
      picture: 'http://placehold.it/32x32',
      age: 34,
      eyeColor: 'brown',
      name: { first: 'Benjamin', last: 'Hicks' },
      company: 'TURNLING',
      email: 'benjamin.hicks@turnling.biz',
      phone: '+1 (895) 537-2895',
      address: '826 Moffat Street, Kraemer, Palau, 5228',
      about: '',
      registered: 'Sunday, December 1, 2019 9:16 AM',
      latitude: '78.627296',
      longitude: '-53.303389',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Karyn Bender' },
        { id: 1, name: 'Marjorie Guerrero' },
        { id: 2, name: 'Dunn Humphrey' }
      ],
      greeting: 'Hello, Benjamin! You have 5 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba52c774ae69e4f6c2',
      index: 57,
      guid: 'a4d37b87-f114-4cad-af94-094b7a507683',
      isActive: true,
      balance: '$2,180.09',
      picture: 'http://placehold.it/32x32',
      age: 36,
      eyeColor: 'blue',
      name: { first: 'Bryan', last: 'Palmer' },
      company: 'COMVEX',
      email: 'bryan.palmer@comvex.biz',
      phone: '+1 (965) 522-2241',
      address: '703 Morgan Avenue, Lindisfarne, Louisiana, 2217',
      about: '',
      registered: 'Wednesday, July 24, 2019 9:21 PM',
      latitude: '58.281572',
      longitude: '-106.449107',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Helena Garrison' },
        { id: 1, name: 'Sherri Morton' },
        { id: 2, name: 'Ladonna Salinas' }
      ],
      greeting: 'Hello, Bryan! You have 10 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba9b7589958c5cb7b4',
      index: 23,
      guid: '8627e4e4-5ff9-48af-ad14-530d095cd207',
      isActive: true,
      balance: '$1,818.97',
      picture: 'http://placehold.it/32x32',
      age: 39,
      eyeColor: 'green',
      name: { first: 'Marsh', last: 'Murray' },
      company: 'TELPOD',
      email: 'marsh.murray@telpod.biz',
      phone: '+1 (807) 574-3045',
      address: '143 Guider Avenue, Tetherow, Missouri, 2529',
      about: '',
      registered: 'Wednesday, February 7, 2018 10:18 AM',
      latitude: '43.565389',
      longitude: '79.25826',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Sallie Mclean' },
        { id: 1, name: 'Carolyn Morse' },
        { id: 2, name: 'Mcdonald Harmon' }
      ],
      greeting: 'Hello, Marsh! You have 8 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba58fafac75ec26b59',
      index: 82,
      guid: '1573b8e7-e0c6-49f4-ab76-5bc40e2b88d2',
      isActive: true,
      balance: '$2,524.21',
      picture: 'http://placehold.it/32x32',
      age: 23,
      eyeColor: 'green',
      name: { first: 'Mercedes', last: 'Frank' },
      company: 'IPLAX',
      email: 'mercedes.frank@iplax.io',
      phone: '+1 (985) 446-2071',
      address: '128 Prospect Street, Cade, Puerto Rico, 8883',
      about: '',
      registered: 'Saturday, May 10, 2014 5:56 AM',
      latitude: '67.292948',
      longitude: '117.697863',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Brennan Moss' },
        { id: 1, name: 'Burns Leonard' },
        { id: 2, name: 'Milagros Fletcher' }
      ],
      greeting: 'Hello, Mercedes! You have 9 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba9a7032d1f32b6885',
      index: 53,
      guid: 'bfedc9df-81a3-414a-a635-f3dfb126883a',
      isActive: false,
      balance: '$1,262.69',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'green',
      name: { first: 'Donna', last: 'Massey' },
      company: 'EMOLTRA',
      email: 'donna.massey@emoltra.tv',
      phone: '+1 (828) 510-3407',
      address: '864 Gunther Place, Floriston, Virginia, 8893',
      about: '',
      registered: 'Monday, October 14, 2019 9:17 PM',
      latitude: '20.360036',
      longitude: '156.585967',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Colleen Brewer' },
        { id: 1, name: 'Bethany Reilly' },
        { id: 2, name: 'Hewitt Oneal' }
      ],
      greeting: 'Hello, Donna! You have 6 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba62dd346901b48f73',
      index: 62,
      guid: 'a723b4ef-df12-4be4-9784-5d606d361cce',
      isActive: true,
      balance: '$3,218.15',
      picture: 'http://placehold.it/32x32',
      age: 26,
      eyeColor: 'brown',
      name: { first: 'Carmella', last: 'Pruitt' },
      company: 'PRISMATIC',
      email: 'carmella.pruitt@prismatic.name',
      phone: '+1 (850) 566-3172',
      address: '654 Grand Avenue, Finderne, Kansas, 923',
      about: '',
      registered: 'Monday, February 1, 2016 1:00 PM',
      latitude: '-64.686458',
      longitude: '-46.247104',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Mollie Trevino' },
        { id: 1, name: 'Josefa Mack' },
        { id: 2, name: 'Zelma Coffey' }
      ],
      greeting: 'Hello, Carmella! You have 5 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824ba9c7a7271ceadc8e1',
      index: 74,
      guid: 'a884320f-71f3-4453-bc9a-975291d25b35',
      isActive: true,
      balance: '$3,077.03',
      picture: 'http://placehold.it/32x32',
      age: 30,
      eyeColor: 'blue',
      name: { first: 'Julie', last: 'Maddox' },
      company: 'ZAGGLE',
      email: 'julie.maddox@zaggle.name',
      phone: '+1 (897) 408-3094',
      address: '702 Banner Avenue, Dragoon, Vermont, 9077',
      about: '',
      registered: 'Saturday, July 23, 2016 3:44 AM',
      latitude: '11.064555',
      longitude: '-145.374831',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Sheppard Olson' },
        { id: 1, name: 'Ericka Sharp' },
        { id: 2, name: 'Ann Gonzalez' }
      ],
      greeting: 'Hello, Julie! You have 5 unread messages.',
      favoriteFruit: 'banana'
    },
    {
      _id: '5e2824ba299a3a40536c4b10',
      index: 34,
      guid: '19b541b9-d037-45b5-8bae-d7ea6a5a3b5c',
      isActive: true,
      balance: '$1,870.04',
      picture: 'http://placehold.it/32x32',
      age: 20,
      eyeColor: 'green',
      name: { first: 'Stella', last: 'Mercer' },
      company: 'GOGOL',
      email: 'stella.mercer@gogol.io',
      phone: '+1 (939) 484-2767',
      address: '100 Powell Street, Oretta, New Mexico, 893',
      about: '',
      registered: 'Friday, August 24, 2018 4:21 AM',
      latitude: '80.145441',
      longitude: '149.322322',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Jeanette Ortiz' },
        { id: 1, name: 'Dominique Reed' },
        { id: 2, name: 'Marsha Ferrell' }
      ],
      greeting: 'Hello, Stella! You have 8 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba2a8b81111fadf37d',
      index: 59,
      guid: '76ebf533-5933-4375-862e-28dfd986b09b',
      isActive: true,
      balance: '$1,163.31',
      picture: 'http://placehold.it/32x32',
      age: 38,
      eyeColor: 'blue',
      name: { first: 'Burch', last: 'Preston' },
      company: 'NURPLEX',
      email: 'burch.preston@nurplex.biz',
      phone: '+1 (810) 471-2620',
      address: '792 Cook Street, Chelsea, New Hampshire, 7225',
      about: '',
      registered: 'Thursday, February 18, 2016 5:27 AM',
      latitude: '85.740552',
      longitude: '86.182126',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Lesa Bradshaw' },
        { id: 1, name: 'Desiree Dennis' },
        { id: 2, name: 'Barnes Delgado' }
      ],
      greeting: 'Hello, Burch! You have 8 unread messages.',
      favoriteFruit: 'strawberry'
    },
    {
      _id: '5e2824ba0f1a3e53a47eaea9',
      index: 64,
      guid: '6ccb4e82-da61-4427-bbb6-ece0a653f1cd',
      isActive: false,
      balance: '$2,930.59',
      picture: 'http://placehold.it/32x32',
      age: 23,
      eyeColor: 'blue',
      name: { first: 'Henderson', last: 'Castaneda' },
      company: 'MARKETOID',
      email: 'henderson.castaneda@marketoid.us',
      phone: '+1 (896) 600-2723',
      address: '851 Lott Street, Wattsville, Georgia, 6811',
      about: '',
      registered: 'Friday, December 15, 2017 5:11 AM',
      latitude: '69.155842',
      longitude: '-149.506465',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Glover Love' },
        { id: 1, name: 'Moses Wall' },
        { id: 2, name: 'Juliette Mccormick' }
      ],
      greeting: 'Hello, Henderson! You have 7 unread messages.',
      favoriteFruit: 'apple'
    },
    {
      _id: '5e2824bae19e8651533a4bfc',
      index: 24,
      guid: '86eb7dff-e5c4-4084-a549-013d8291ec94',
      isActive: false,
      balance: '$3,583.18',
      picture: 'http://placehold.it/32x32',
      age: 23,
      eyeColor: 'green',
      name: { first: 'Woods', last: 'Mccarthy' },
      company: 'GEEKUS',
      email: 'woods.mccarthy@geekus.me',
      phone: '+1 (978) 518-3640',
      address: '843 Beverly Road, Silkworth, Puerto Rico, 3038',
      about: '',
      registered: 'Tuesday, March 18, 2014 12:06 AM',
      latitude: '-78.115183',
      longitude: '155.819947',
      tags: ['', '', '', '', ''],
      range: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      friends: [
        { id: 0, name: 'Cummings Jimenez' },
        { id: 1, name: 'Neal Stuart' },
        { id: 2, name: 'Maynard Velez' }
      ],
      greeting: 'Hello, Woods! You have 5 unread messages.',
      favoriteFruit: 'apple'
    }
  ];

  beforeEach((done) => {
    rimraf(tempDir, (err1) => {
      if (err1) return done(err1);

      fs.mkdir(tempDir, (err2) => {
        done(err2);
      });
    });
  });

  afterAll((done) => {
    rimraf(tempDir, done);
  });

  it('Should sort flat 10 int array in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat10intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      tempDir
    }).asc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat10int.sort((a, b) => a - b));
  });

  it('Should sort flat 10 int array in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat10intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      tempDir
    }).desc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat10int.sort((a, b) => b - a));
  });

  it('Should sort flat 100 int array in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      tempDir
    }).asc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat100int.sort((a: number, b: number) => a - b));
  });

  it('Should sort flat 100 int array in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      tempDir
    }).desc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat100int.sort((a, b) => b - a));
  });

  it('Should sort flat 100 int array in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      maxHeap: 10,
      tempDir
    }).asc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat100int.sort((a, b) => a - b));
  });

  it('Should sort flat 100 int array in desc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100intPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string) => parseInt(s, 10),
      serializer: (n: number) => n.toString(10),
      maxHeap: 10,
      tempDir
    }).desc();

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s: string) => parseInt(s, 10));

    // remove NaN
    output.pop();

    expect(output).toEqual(flat100int.sort((a, b) => b - a));
  });

  it('Should sort flat 100 string array in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100stringPath),
      output: fs.createWriteStream(outputPath),
      tempDir
    }).asc();

    const output = (await fsp.readFile(outputPath)).toString().split('\n');

    output.pop();

    expect(output).toEqual(
      flat100string.sort((a, b) => {
        if (a < b) return -1;
        if (a === b) return 0;

        return 1;
      })
    );
  });

  it('Should sort flat 100 string array in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100stringPath),
      output: fs.createWriteStream(outputPath),
      tempDir
    }).desc();

    const output = (await fsp.readFile(outputPath)).toString().split('\n');

    output.pop();

    expect(output).toEqual(
      flat100string.sort((a, b) => {
        if (a < b) return 1;
        if (a === b) return 0;

        return -1;
      })
    );
  });

  it('Should sort flat 100 string array in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100stringPath),
      output: fs.createWriteStream(outputPath),
      maxHeap: 10,
      tempDir
    }).asc();

    const output = (await fsp.readFile(outputPath)).toString().split('\n');

    output.pop();

    expect(output).toEqual(
      flat100string.sort((a, b) => {
        if (a < b) return -1;
        if (a === b) return 0;

        return 1;
      })
    );
  });

  it('Should sort flat 100 string array in desc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100stringPath),
      output: fs.createWriteStream(outputPath),
      maxHeap: 10,
      tempDir
    }).desc();

    const output = (await fsp.readFile(outputPath)).toString().split('\n');

    output.pop();

    expect(output).toEqual(
      flat100string.sort((a, b) => {
        if (a < b) return 1;
        if (a === b) return 0;

        return -1;
      })
    );
  });

  it('Should sort 100 object array by property in asc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string): ITestObject => JSON.parse(s),
      serializer: JSON.stringify,
      tempDir
    }).asc((v: ITestObject) => v.index);

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch (e) {
          return null;
        }
      });

    output.pop();

    expect(output).toEqual(flat100object.sort((a, b) => a.index - b.index));
  });

  it('Should sort 100 object array by property in desc order with default options', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string): ITestObject => JSON.parse(s),
      serializer: JSON.stringify,
      tempDir
    }).desc((v: ITestObject) => v.index);

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch (e) {
          return null;
        }
      });

    output.pop();

    expect(output).toEqual(flat100object.sort((a, b) => b.index - a.index));
  });

  it('Should sort 100 object array by property in asc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string): ITestObject => JSON.parse(s),
      serializer: JSON.stringify,
      maxHeap: 10,
      tempDir
    }).asc((v: ITestObject) => v.index);

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch (e) {
          return null;
        }
      });

    output.pop();

    expect(output).toEqual(flat100object.sort((a, b) => a.index - b.index));
  });

  it('Should sort 100 object array by property in desc order with 10 heapSize', async () => {
    await esort({
      input: fs.createReadStream(flat100objectPath),
      output: fs.createWriteStream(outputPath),
      deserializer: (s: string): ITestObject => JSON.parse(s),
      serializer: JSON.stringify,
      maxHeap: 10,
      tempDir
    }).desc((v: ITestObject) => v.index);

    const output = (await fsp.readFile(outputPath))
      .toString()
      .split('\n')
      .map((s) => {
        try {
          return JSON.parse(s);
        } catch (e) {
          return null;
        }
      });

    output.pop();

    expect(output).toEqual(flat100object.sort((a, b) => b.index - a.index));
  });
});
