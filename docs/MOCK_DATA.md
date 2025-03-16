# Mock Data for Akewi App

This document contains example mock data structures to be used during development before integrating with real APIs.

## Users

```json
[
  {
    "id": "user1",
    "name": "Omolola Ogunbiyi",
    "state": "Osun",
    "town": "Ilé-Ifẹ́",
    "family": "Adéwálé",
    "profileImage": "https://example.com/profiles/user1.jpg",
    "preferredLanguage": "yoruba",
    "stats": {
      "contributions": 5093,
      "streams": 200000
    },
    "dateJoined": "2023-02-15"
  },
  {
    "id": "user2",
    "name": "Adebayo Johnson",
    "state": "Lagos",
    "town": "Ikeja",
    "family": "Ogunlana",
    "profileImage": null,
    "preferredLanguage": "english",
    "stats": {
      "contributions": 42,
      "streams": 5832
    },
    "dateJoined": "2023-05-21"
  },
  {
    "id": "user3",
    "name": "Folake Adeleke",
    "state": "Oyo",
    "town": "Ibadan",
    "family": "Aladejobi",
    "profileImage": "https://example.com/profiles/user3.jpg",
    "preferredLanguage": "yoruba",
    "stats": {
      "contributions": 156,
      "streams": 23451
    },
    "dateJoined": "2023-03-08"
  }
]
```

## Oriki Content

```json
[
  {
    "id": "oriki1",
    "title": "Oriki Idílé Adéwálé",
    "description": "Family oriki celebrating the lineage of the Adéwálé family",
    "type": "family",
    "initialText": "WA",
    "initialColor": "#C73D10",
    "hasAudio": true,
    "audioUrl": "/assets/dummy/audio/oriki1.mp3",
    "lyricsContent": {
      "yoruba": "Adéwálé, ọmọ akin.\nỌmọ olúwa ilẹ̀.\nẸni tó dá omi sí ẹnu àkọ́.\nBí ẹyẹ sàn, bí ẹyẹ yọrí.",
      "english": "Adéwálé, child of the brave.\nOwner of the land.\nThe one who puts water in the mouth of the firstborn.\nLike a bird flies, like a bird raises its head."
    },
    "lyricsSections": {
      "yoruba": [
        { "text": "Adéwálé, ọmọ akin.", "startTime": 3.5, "endTime": 8.2, "index": 0 },
        { "text": "Ọmọ olúwa ilẹ̀.", "startTime": 8.3, "endTime": 12.1, "index": 1 },
        { "text": "Ẹni tó dá omi sí ẹnu àkọ́.", "startTime": 12.2, "endTime": 17.8, "index": 2 },
        { "text": "Bí ẹyẹ sàn, bí ẹyẹ yọrí.", "startTime": 17.9, "endTime": 22.5, "index": 3 }
      ],
      "english": [
        { "text": "Adéwálé, child of the brave.", "startTime": 3.5, "endTime": 8.2, "index": 0 },
        { "text": "Owner of the land.", "startTime": 8.3, "endTime": 12.1, "index": 1 },
        {
          "text": "The one who puts water in the mouth of the firstborn.",
          "startTime": 12.2,
          "endTime": 17.8,
          "index": 2
        },
        {
          "text": "Like a bird flies, like a bird raises its head.",
          "startTime": 17.9,
          "endTime": 22.5,
          "index": 3
        }
      ]
    },
    "isSynchronized": {
      "yoruba": true,
      "english": true
    },
    "metadata": {
      "duration": 25.8,
      "language": "yoruba",
      "region": "Osun",
      "family": "Adéwálé",
      "tags": ["family", "heritage", "lineage"],
      "contributor": {
        "id": "user1",
        "name": "Omolola Ogunbiyi"
      }
    },
    "dateAdded": "2023-06-12",
    "lastModified": "2023-06-15"
  },
  {
    "id": "oriki2",
    "title": "Oriki Ilé-Ifẹ́",
    "description": "Regional oriki celebrating the historical city of Ilé-Ifẹ́",
    "type": "community",
    "initialText": "IF",
    "initialColor": "#2A9D8F",
    "hasAudio": true,
    "audioUrl": "/assets/dummy/audio/oriki2.mp3",
    "lyricsContent": {
      "yoruba": "Ilé-Ifẹ́, ibi ojúmọ́ ti ń mọ́ wá.\nIlẹ̀ tó ní agbára.\nIbi àwọn àgbà gbé ń ṣàṣàrò.\nÌfẹ́ ni a bí mi.",
      "english": "Ilé-Ifẹ́, where daylight originates.\nLand of power.\nWhere the elders gather to deliberate.\nI was born in Ifẹ́."
    },
    "lyricsSections": {
      "yoruba": [
        { "text": "Ilé-Ifẹ́, ibi ojúmọ́ ti ń mọ́ wá.", "startTime": 2.1, "endTime": 7.4, "index": 0 },
        { "text": "Ilẹ̀ tó ní agbára.", "startTime": 7.5, "endTime": 11.2, "index": 1 },
        { "text": "Ibi àwọn àgbà gbé ń ṣàṣàrò.", "startTime": 11.3, "endTime": 16.8, "index": 2 },
        { "text": "Ìfẹ́ ni a bí mi.", "startTime": 16.9, "endTime": 20.3, "index": 3 }
      ],
      "english": [
        {
          "text": "Ilé-Ifẹ́, where daylight originates.",
          "startTime": 2.1,
          "endTime": 7.4,
          "index": 0
        },
        { "text": "Land of power.", "startTime": 7.5, "endTime": 11.2, "index": 1 },
        {
          "text": "Where the elders gather to deliberate.",
          "startTime": 11.3,
          "endTime": 16.8,
          "index": 2
        },
        { "text": "I was born in Ifẹ́.", "startTime": 16.9, "endTime": 20.3, "index": 3 }
      ]
    },
    "isSynchronized": {
      "yoruba": true,
      "english": true
    },
    "metadata": {
      "duration": 22.5,
      "language": "yoruba",
      "region": "Osun",
      "family": null,
      "tags": ["city", "heritage", "royal", "historical"],
      "contributor": {
        "id": "user3",
        "name": "Folake Adeleke"
      }
    },
    "dateAdded": "2023-04-20",
    "lastModified": "2023-04-22"
  },
  {
    "id": "oriki3",
    "title": "Oriki Ṣàngó",
    "description": "Deity oriki honoring Ṣàngó, the deity of thunder and lightning",
    "type": "deity",
    "initialText": "SA",
    "initialColor": "#E76F51",
    "hasAudio": true,
    "audioUrl": "/assets/dummy/audio/oriki3.mp3",
    "lyricsContent": {
      "yoruba": "Ṣàngó, àrá ọ̀run.\nAláńtákùn, Alápàndẹ́dẹ́.\nKábíyèsí Ọba, Àtàndá Adélósìn.\nA jẹ́ Kò so, à jẹ́ má bò sí ilé.",
      "english": "Ṣàngó, thunder from heaven.\nThe one who strikes with lightning.\nRoyal Majesty, Àtàndá Adélósìn.\nOne who eats and does not vomit, one who eats and still comes home."
    },
    "lyricsSections": {
      "yoruba": [
        { "text": "Ṣàngó, àrá ọ̀run.", "startTime": 4.1, "endTime": 8.6, "index": 0 },
        { "text": "Aláńtákùn, Alápàndẹ́dẹ́.", "startTime": 8.7, "endTime": 13.2, "index": 1 },
        {
          "text": "Kábíyèsí Ọba, Àtàndá Adélósìn.",
          "startTime": 13.3,
          "endTime": 19.1,
          "index": 2
        },
        { "text": "A jẹ́ Kò so, à jẹ́ má bò sí ilé.", "startTime": 19.2, "endTime": 26.4, "index": 3 }
      ],
      "english": [
        { "text": "Ṣàngó, thunder from heaven.", "startTime": 4.1, "endTime": 8.6, "index": 0 },
        {
          "text": "The one who strikes with lightning.",
          "startTime": 8.7,
          "endTime": 13.2,
          "index": 1
        },
        {
          "text": "Royal Majesty, Àtàndá Adélósìn.",
          "startTime": 13.3,
          "endTime": 19.1,
          "index": 2
        },
        {
          "text": "One who eats and does not vomit, one who eats and still comes home.",
          "startTime": 19.2,
          "endTime": 26.4,
          "index": 3
        }
      ]
    },
    "isSynchronized": {
      "yoruba": true,
      "english": true
    },
    "metadata": {
      "duration": 28.2,
      "language": "yoruba",
      "region": null,
      "family": null,
      "tags": ["deity", "spiritual", "traditional", "orisa"],
      "contributor": {
        "id": "user2",
        "name": "Adebayo Johnson"
      }
    },
    "dateAdded": "2023-05-30",
    "lastModified": "2023-05-30"
  },
  {
    "id": "oriki4",
    "title": "Oriki Ọdẹ",
    "description": "Occupational oriki celebrating hunters and their bravery",
    "type": "cultural",
    "initialText": "OD",
    "initialColor": "#264653",
    "hasAudio": false,
    "lyricsContent": {
      "yoruba": "Ọmọ Ọdẹ, akin ogun.\nỌmọ onígbá ọta ṣíṣẹ́.\nṢíṣẹ́ ló ń ṣíṣẹ́ bo ọmọ èèyàn lórí.\nỌmọ onígbá oògùn méjì.",
      "english": "Child of the Hunter, brave warrior.\nChild of the one with a quiver full of arrows.\nArrows that can pierce through a person's head.\nChild of the one with two medicine gourds."
    },
    "isSynchronized": {
      "yoruba": false,
      "english": false
    },
    "metadata": {
      "language": "yoruba",
      "region": null,
      "family": null,
      "tags": ["hunters", "occupation", "bravery", "cultural"],
      "contributor": {
        "id": "user3",
        "name": "Folake Adeleke"
      }
    },
    "dateAdded": "2023-06-05",
    "lastModified": "2023-06-05"
  }
]
```

## Categories

```json
[
  {
    "id": "cat1",
    "title": "Oriki Idílé",
    "description": "Family/Lineage Oriki",
    "count": 157,
    "backgroundColor": "#C73D10",
    "textColor": "#FFFFFF",
    "iconType": "family"
  },
  {
    "id": "cat2",
    "title": "Oriki Orílè-èdè",
    "description": "Community/Regional Oriki",
    "count": 92,
    "backgroundColor": "#2A9D8F",
    "textColor": "#FFFFFF",
    "iconType": "community"
  },
  {
    "id": "cat3",
    "title": "Oriki Àwọn Òrìṣà",
    "description": "Deity/Spiritual Oriki",
    "count": 63,
    "backgroundColor": "#E76F51",
    "textColor": "#FFFFFF",
    "iconType": "deity"
  },
  {
    "id": "cat4",
    "title": "Oriki Ìṣẹ́",
    "description": "Occupational Oriki",
    "count": 45,
    "backgroundColor": "#264653",
    "textColor": "#FFFFFF",
    "iconType": "occupation"
  },
  {
    "id": "cat5",
    "title": "Oriki Ẹ̀yà",
    "description": "Ethnic Group Oriki",
    "count": 78,
    "backgroundColor": "#E9C46A",
    "textColor": "#000000",
    "iconType": "ethnic"
  }
]
```

## User Contributions

```json
[
  {
    "userId": "user1",
    "contributions": [
      {
        "id": "oriki1",
        "title": "Oriki Idílé Adéwálé",
        "type": "family",
        "dateAdded": "2023-06-12",
        "hasAudio": true,
        "isSynchronized": {
          "yoruba": true,
          "english": true
        },
        "status": "approved"
      },
      {
        "id": "oriki5",
        "title": "Oriki Òkun",
        "type": "cultural",
        "dateAdded": "2023-06-05",
        "hasAudio": true,
        "isSynchronized": {
          "yoruba": true,
          "english": false
        },
        "status": "pending"
      }
    ],
    "byDate": {
      "2023-06-12": ["oriki1"],
      "2023-06-05": ["oriki5"]
    }
  },
  {
    "userId": "user2",
    "contributions": [
      {
        "id": "oriki3",
        "title": "Oriki Ṣàngó",
        "type": "deity",
        "dateAdded": "2023-05-30",
        "hasAudio": true,
        "isSynchronized": {
          "yoruba": true,
          "english": true
        },
        "status": "approved"
      }
    ],
    "byDate": {
      "2023-05-30": ["oriki3"]
    }
  },
  {
    "userId": "user3",
    "contributions": [
      {
        "id": "oriki2",
        "title": "Oriki Ilé-Ifẹ́",
        "type": "community",
        "dateAdded": "2023-04-20",
        "hasAudio": true,
        "isSynchronized": {
          "yoruba": true,
          "english": true
        },
        "status": "approved"
      },
      {
        "id": "oriki4",
        "title": "Oriki Ọdẹ",
        "type": "cultural",
        "dateAdded": "2023-06-05",
        "hasAudio": false,
        "isSynchronized": {
          "yoruba": false,
          "english": false
        },
        "status": "approved"
      }
    ],
    "byDate": {
      "2023-04-20": ["oriki2"],
      "2023-06-05": ["oriki4"]
    }
  }
]
```

## Mock API Implementation Example

Create the file `src/services/api/mockApiClient.ts` with the following content:

```typescript
import users from '../../assets/dummy/users.json';
import oriki from '../../assets/dummy/oriki.json';
import categories from '../../assets/dummy/categories.json';
import contributions from '../../assets/dummy/contributions.json';

// Add random delay to simulate network latency
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const randomDelay = () => delay(500 + Math.random() * 1000);

export const mockApiClient = {
  // Auth methods
  login: async (identifier: string) => {
    await randomDelay();
    // Simulate login logic
    return { verificationId: 'mock-verification-id' };
  },

  verifyCode: async (verificationId: string, code: string) => {
    await randomDelay();
    // Simulate verification
    return { token: 'mock-token-xxx', user: users[0] };
  },

  // User methods
  getUserProfile: async (userId: string) => {
    await randomDelay();
    return users.find(user => user.id === userId);
  },

  updateUserProfile: async (userId: string, data: any) => {
    await randomDelay();
    // Simulate profile update
    return { ...users.find(user => user.id === userId), ...data };
  },

  // Content methods
  getFeaturedOriki: async () => {
    await randomDelay();
    return oriki.slice(0, 3);
  },

  getPopularOriki: async () => {
    await randomDelay();
    return oriki.slice(3, 8);
  },

  getCategories: async () => {
    await randomDelay();
    return categories;
  },

  getOrikiById: async (id: string) => {
    await randomDelay();
    return oriki.find(item => item.id === id);
  },

  getOrikiByCategory: async (categoryId: string) => {
    await randomDelay();
    return oriki.filter(item => {
      const category = categories.find(cat => cat.id === categoryId);
      if (!category) return false;

      // Match by type
      const categoryType = category.iconType;
      return item.type === categoryType;
    });
  },

  searchOriki: async (query: string) => {
    await randomDelay();
    return oriki.filter(
      item =>
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
    );
  },

  // Contribution methods
  getUserContributions: async (userId: string) => {
    await randomDelay();
    const userContribution = contributions.find(c => c.userId === userId);
    return userContribution?.contributions || [];
  },

  submitOriki: async (data: any) => {
    await randomDelay();
    // Simulate creating a new oriki
    const newId = `oriki${oriki.length + 1}`;
    return { id: newId, ...data, dateAdded: new Date().toISOString().split('T')[0] };
  },

  uploadAudio: async (fileUri: string, onProgress: (progress: number) => void) => {
    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await delay(300);
      onProgress(i);
    }

    return { audioUrl: `/assets/dummy/audio/new-audio-${Date.now()}.mp3` };
  },

  synchronizeLyrics: async (orikiId: string, lyricsSections: any) => {
    await randomDelay();
    return { success: true, id: orikiId, lyricsSections };
  },
};
```

Place the following JSON files in the appropriate locations:

- `src/assets/dummy/users.json` - User profiles
- `src/assets/dummy/oriki.json` - Oriki content
- `src/assets/dummy/categories.json` - Categories
- `src/assets/dummy/contributions.json` - User contributions
