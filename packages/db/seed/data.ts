import { IssueStatus, Role } from "../generated/prisma/enums"


export const User = [
    {
      "id": "582bcbff-3b3e-4154-a7a6-3e6486930d3a",
      "name": "Arjun Sharma",
      "email": "arjun.sharma@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "b0910ee7-437a-4ed7-9f70-fe68cf0f5734",
      "name": "Priya Das",
      "email": "priya.das@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "3ad25d9e-c8e3-47b8-8599-8664f726d49b",
      "name": "Rahul Sen",
      "email": "rahul.sen@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "21952515-ce91-4d75-8665-feb5792d3c93",
      "name": "Ananya Roy",
      "email": "ananya.roy@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "b63a3d75-b5ea-4885-b2b3-654e7a98d40c",
      "name": "Sourav Ghosh",
      "email": "sourav.ghosh@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "255ae22e-e41f-41d5-90da-d9949bb6c8fb",
      "name": "Neha Singh",
      "email": "neha.singh@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "70662099-275e-468f-9200-45920bff4e81",
      "name": "Rohan Gupta",
      "email": "rohan.gupta@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "a11077fc-e594-4007-82e3-a80f6c86fd4f",
      "name": "Sneha Banerjee",
      "email": "sneha.banerjee@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "697108b3-939b-42df-8408-065060a865bd",
      "name": "Amit Kumar",
      "email": "amit.kumar@example.com",
      "password": "$2b$10$examplehashedpassword"
    },
    {
      "id": "23624c89-d6b1-49e9-a612-2b71fcd95db5",
      "name": "Ishita Mukherjee",
      "email": "ishita.mukherjee@example.com",
      "password": "$2b$10$examplehashedpassword"
    }
  ]
export const Organization = [
    {
      "id": "202b93ba-1aa3-4a98-bbe5-6ea0c1cb6d9e",
      "name": "Acme Technologies",
      "description": "Software development and technology solutions."
    },
    {
      "id": "e396db90-9905-47e4-b060-403a653b2b66",
      "name": "Pixel Labs",
      "description": "Product design and frontend engineering team."
    },
    {
      "id": "512cfc4f-0ce9-4dd9-a940-ba0b280fcbf4",
      "name": "CloudNova",
      "description": "Cloud infrastructure and DevOps organization."
    },
    {
      "id": "53a83632-3066-43cd-a4e7-5e6f7d2bbe0f",
      "name": "DataForge",
      "description": "Data engineering and analytics organization."
    },
    {
      "id": "a212516a-8ddf-4ac4-91a2-60ba243f2712",
      "name": "FinEdge",
      "description": "Financial technology product team."
    },
    {
      "id": "9fe6cc90-0635-4a13-95d8-d27cd4be28ab",
      "name": "HealthSync",
      "description": "Digital healthcare platform team."
    },
    {
      "id": "41da5217-0314-452a-b85f-eebd794a52c2",
      "name": "EduSphere",
      "description": "Online education technology organization."
    },
    {
      "id": "211f2bf5-f463-4db9-9f0e-2de61717f690",
      "name": "MarketPro",
      "description": "Marketing and customer engagement team."
    },
    {
      "id": "ca2de8ac-7303-43c5-a7fe-2778874309ef",
      "name": "GameVerse",
      "description": "Game development and interactive media team."
    },
    {
      "id": "709e1764-cabc-445b-ab6f-5f54a2156ce4",
      "name": "GreenGrid",
      "description": "Sustainability and clean technology organization."
    }
  ]
export const OrganizationUser = [
    {
      "id": "901f95ac-440c-4742-a9e5-754f055c8a61",
      "role": Role.ADMIN,
      "userID": "582bcbff-3b3e-4154-a7a6-3e6486930d3a",
      "organizationID": "202b93ba-1aa3-4a98-bbe5-6ea0c1cb6d9e"
    },
    {
      "id": "83c4ed52-afd0-4086-b5b9-c6ac40089eeb",
      "role": Role.MEMBER,
      "userID": "b0910ee7-437a-4ed7-9f70-fe68cf0f5734",
      "organizationID": "e396db90-9905-47e4-b060-403a653b2b66"
    },
    {
      "id": "844be289-c61f-4e6a-854b-1f0a44e08262",
      "role": Role.ADMIN,
      "userID": "3ad25d9e-c8e3-47b8-8599-8664f726d49b",
      "organizationID": "512cfc4f-0ce9-4dd9-a940-ba0b280fcbf4"
    },
    {
      "id": "177b839b-c704-424b-a0f3-6427a2c1924f",
      "role": Role.MEMBER,
      "userID": "21952515-ce91-4d75-8665-feb5792d3c93",
      "organizationID": "53a83632-3066-43cd-a4e7-5e6f7d2bbe0f"
    },
    {
      "id": "d19600fa-128d-49c6-a90e-f3efdf729b10",
      "role": Role.ADMIN,
      "userID": "b63a3d75-b5ea-4885-b2b3-654e7a98d40c",
      "organizationID": "a212516a-8ddf-4ac4-91a2-60ba243f2712"
    },
    {
      "id": "f9a2b08e-1c30-4711-b0d5-c9c7c93bd38f",
      "role": Role.MEMBER,
      "userID": "255ae22e-e41f-41d5-90da-d9949bb6c8fb",
      "organizationID": "9fe6cc90-0635-4a13-95d8-d27cd4be28ab"
    },
    {
      "id": "519a6511-a0b9-48e7-b042-bdcaa1654a57",
      "role": Role.ADMIN,
      "userID": "70662099-275e-468f-9200-45920bff4e81",
      "organizationID": "41da5217-0314-452a-b85f-eebd794a52c2"
    },
    {
      "id": "6dc95858-5cd8-494c-9c9c-cad5ca564a27",
      "role": Role.MEMBER,
      "userID": "a11077fc-e594-4007-82e3-a80f6c86fd4f",
      "organizationID": "211f2bf5-f463-4db9-9f0e-2de61717f690"
    },
    {
      "id": "c1483ad7-f56a-4f0d-a370-f0e3681746ac",
      "role": Role.ADMIN,
      "userID": "697108b3-939b-42df-8408-065060a865bd",
      "organizationID": "ca2de8ac-7303-43c5-a7fe-2778874309ef"
    },
    {
      "id": "102f7042-e2a6-4dc3-892a-ef092bad628e",
      "role": Role.MEMBER,
      "userID": "23624c89-d6b1-49e9-a612-2b71fcd95db5",
      "organizationID": "709e1764-cabc-445b-ab6f-5f54a2156ce4"
    }
  ]
export const Board = [
    {
      "id": "7261edb1-e690-476b-85c9-cdf686d634c8",
      "title": "Website Redesign",
      "organizationID": "202b93ba-1aa3-4a98-bbe5-6ea0c1cb6d9e"
    },
    {
      "id": "8a197559-0f1f-458f-aac2-55301779716b",
      "title": "Mobile App",
      "organizationID": "e396db90-9905-47e4-b060-403a653b2b66"
    },
    {
      "id": "a93f85c5-8db2-426f-90ea-6d58c1f3419d",
      "title": "Infrastructure",
      "organizationID": "512cfc4f-0ce9-4dd9-a940-ba0b280fcbf4"
    },
    {
      "id": "102e4066-90b4-49d1-a168-da2b6575187f",
      "title": "Analytics Platform",
      "organizationID": "53a83632-3066-43cd-a4e7-5e6f7d2bbe0f"
    },
    {
      "id": "1ed8a6cd-2abc-411a-a35e-e31aa492482c",
      "title": "Payments",
      "organizationID": "a212516a-8ddf-4ac4-91a2-60ba243f2712"
    },
    {
      "id": "2168910f-4ce6-49fd-bea7-5de6d99d9493",
      "title": "Healthcare Portal",
      "organizationID": "9fe6cc90-0635-4a13-95d8-d27cd4be28ab"
    },
    {
      "id": "37820cc6-8b0f-4127-8b40-b8326dd9b6a2",
      "title": "Learning Platform",
      "organizationID": "41da5217-0314-452a-b85f-eebd794a52c2"
    },
    {
      "id": "00f39fe3-41d0-4efe-b5aa-4962dfd07980",
      "title": "Marketing Campaign",
      "organizationID": "211f2bf5-f463-4db9-9f0e-2de61717f690"
    },
    {
      "id": "8e8b03a9-4f43-452b-bd6d-e698246837bd",
      "title": "Game Launch",
      "organizationID": "ca2de8ac-7303-43c5-a7fe-2778874309ef"
    },
    {
      "id": "b95a5961-6793-4118-ae40-0b62bb6c486b",
      "title": "Sustainability Dashboard",
      "organizationID": "709e1764-cabc-445b-ab6f-5f54a2156ce4"
    }
  ]
export const Section = [
    {
      "id": "9b5cf237-ab6f-4076-b7c0-d64c74018568",
      "status": IssueStatus.OPEN,
      "boardId": "7261edb1-e690-476b-85c9-cdf686d634c8"
    },
    {
      "id": "b194ffda-2d1d-418e-b39e-b435d7e5cd05",
      "status": IssueStatus.IN_PROGRESS,
      "boardId": "8a197559-0f1f-458f-aac2-55301779716b"
    },
    {
      "id": "2fd37555-2776-47e5-99cd-5ccb55401778",
      "status": IssueStatus.UPCOMING,
      "boardId": "a93f85c5-8db2-426f-90ea-6d58c1f3419d"
    },
    {
      "id": "277651f1-05cc-4445-a943-e14ab3b96e26",
      "status": IssueStatus.OPEN,
      "boardId": "102e4066-90b4-49d1-a168-da2b6575187f"
    },
    {
      "id": "5ddd02fb-1262-42ef-bb15-185feb7e8436",
      "status": IssueStatus.CLOSED,
      "boardId": "1ed8a6cd-2abc-411a-a35e-e31aa492482c"
    },
    {
      "id": "63e63dcb-08a3-4c3f-abf0-5e0d49de7507",
      "status": IssueStatus.OPEN,
      "boardId": "2168910f-4ce6-49fd-bea7-5de6d99d9493"
    },
    {
      "id": "3261376a-039c-4710-97d2-8faec274f725",
      "status": IssueStatus.IN_PROGRESS,
      "boardId": "37820cc6-8b0f-4127-8b40-b8326dd9b6a2"
    },
    {
      "id": "9b389ee4-c650-431b-855a-bd54149807f6",
      "status": IssueStatus.UPCOMING,
      "boardId": "00f39fe3-41d0-4efe-b5aa-4962dfd07980"
    },
    {
      "id": "ecfcdf27-6932-4c01-91ad-b17606a80d08",
      "status": IssueStatus.OPEN,
      "boardId": "8e8b03a9-4f43-452b-bd6d-e698246837bd"
    },
    {
      "id": "a56f5687-33c4-4c5f-8e12-84e9cd1e163d",
      "status": IssueStatus.CLOSED,
      "boardId": "b95a5961-6793-4118-ae40-0b62bb6c486b"
    }
  ]
export const Issue = [
    {
      "id": "17f4182a-71ba-42a3-bdf6-c2962f59bc5f",
      "title": "Implement authentication",
      "description": "Add secure login and registration using JWT.",
      "sectionID": "9b5cf237-ab6f-4076-b7c0-d64c74018568",
      "boardId": "7261edb1-e690-476b-85c9-cdf686d634c8"
    },
    {
      "id": "8af91c15-909c-4fff-ae9f-80242e8a8745",
      "title": "Improve dashboard UI",
      "description": "Redesign the dashboard for better usability.",
      "sectionID": "b194ffda-2d1d-418e-b39e-b435d7e5cd05",
      "boardId": "8a197559-0f1f-458f-aac2-55301779716b"
    },
    {
      "id": "0e625b92-3d28-44f0-870c-24a5896e04f0",
      "title": "Fix deployment pipeline",
      "description": "Resolve failures in the production deployment workflow.",
      "sectionID": "2fd37555-2776-47e5-99cd-5ccb55401778",
      "boardId": "a93f85c5-8db2-426f-90ea-6d58c1f3419d"
    },
    {
      "id": "21da4bf1-e719-4915-8d9d-83804bbf6e2f",
      "title": "Add analytics reports",
      "description": "Create reports for weekly and monthly product metrics.",
      "sectionID": "277651f1-05cc-4445-a943-e14ab3b96e26",
      "boardId": "102e4066-90b4-49d1-a168-da2b6575187f"
    },
    {
      "id": "5a096c5e-0287-48d4-9764-d528d91481ad",
      "title": "Integrate payment gateway",
      "description": "Integrate the payment provider and handle webhooks.",
      "sectionID": "5ddd02fb-1262-42ef-bb15-185feb7e8436",
      "boardId": "1ed8a6cd-2abc-411a-a35e-e31aa492482c"
    },
    {
      "id": "626fe404-7a6a-485e-ad58-ffe0c9dd24e9",
      "title": "Create patient profile",
      "description": "Build the patient profile management interface.",
      "sectionID": "63e63dcb-08a3-4c3f-abf0-5e0d49de7507",
      "boardId": "2168910f-4ce6-49fd-bea7-5de6d99d9493"
    },
    {
      "id": "b8298f62-aea0-4fe2-ad91-92ac8ce8bc5d",
      "title": "Add course progress",
      "description": "Track and display student course completion.",
      "sectionID": "3261376a-039c-4710-97d2-8faec274f725",
      "boardId": "37820cc6-8b0f-4127-8b40-b8326dd9b6a2"
    },
    {
      "id": "ff6b77e3-ab4c-4e34-9382-658bc5eff172",
      "title": "Build campaign editor",
      "description": "Create an editor for marketing campaign content.",
      "sectionID": "9b389ee4-c650-431b-855a-bd54149807f6",
      "boardId": "00f39fe3-41d0-4efe-b5aa-4962dfd07980"
    },
    {
      "id": "4620e312-1689-4be5-a8f7-c8e35da594b3",
      "title": "Optimize game loading",
      "description": "Reduce initial loading time and improve asset caching.",
      "sectionID": "ecfcdf27-6932-4c01-91ad-b17606a80d08",
      "boardId": "8e8b03a9-4f43-452b-bd6d-e698246837bd"
    },
    {
      "id": "0e1003a2-04d2-4aef-825c-b61ce288fb81",
      "title": "Add carbon metrics",
      "description": "Display environmental impact and sustainability metrics.",
      "sectionID": "a56f5687-33c4-4c5f-8e12-84e9cd1e163d",
      "boardId": "b95a5961-6793-4118-ae40-0b62bb6c486b"
    }
  ]
export const IssueUser = [
    {
      "id": "77946996-c26d-4592-87e7-aa3414a94e6b",
      "issueID": "17f4182a-71ba-42a3-bdf6-c2962f59bc5f",
      "userID": "b0910ee7-437a-4ed7-9f70-fe68cf0f5734"
    },
    {
      "id": "0f6bb812-c59c-4877-9bc8-f37c3ffd7b7f",
      "issueID": "8af91c15-909c-4fff-ae9f-80242e8a8745",
      "userID": "3ad25d9e-c8e3-47b8-8599-8664f726d49b"
    },
    {
      "id": "007e7403-efb7-49ea-9df0-ad7e5d143101",
      "issueID": "0e625b92-3d28-44f0-870c-24a5896e04f0",
      "userID": "21952515-ce91-4d75-8665-feb5792d3c93"
    },
    {
      "id": "52b83e17-ac59-484b-bc49-6ac9a2dcdbad",
      "issueID": "21da4bf1-e719-4915-8d9d-83804bbf6e2f",
      "userID": "b63a3d75-b5ea-4885-b2b3-654e7a98d40c"
    },
    {
      "id": "67d8e352-2571-46c5-961a-2c0dc5b1bb97",
      "issueID": "5a096c5e-0287-48d4-9764-d528d91481ad",
      "userID": "255ae22e-e41f-41d5-90da-d9949bb6c8fb"
    },
    {
      "id": "d1d5cbeb-dae6-48b8-8dc2-8d3438bbbce5",
      "issueID": "626fe404-7a6a-485e-ad58-ffe0c9dd24e9",
      "userID": "70662099-275e-468f-9200-45920bff4e81"
    },
    {
      "id": "f2fef3c7-5ce8-4ea6-9656-7978205e9a06",
      "issueID": "b8298f62-aea0-4fe2-ad91-92ac8ce8bc5d",
      "userID": "a11077fc-e594-4007-82e3-a80f6c86fd4f"
    },
    {
      "id": "55fc5b49-7f29-4680-99a3-c164063f97a3",
      "issueID": "ff6b77e3-ab4c-4e34-9382-658bc5eff172",
      "userID": "697108b3-939b-42df-8408-065060a865bd"
    },
    {
      "id": "5ee8947b-ba0d-48d2-82e3-2a329cbc0ebd",
      "issueID": "4620e312-1689-4be5-a8f7-c8e35da594b3",
      "userID": "23624c89-d6b1-49e9-a612-2b71fcd95db5"
    },
    {
      "id": "b07f7d55-6c4b-4ded-a6b0-7a03915fe8c5",
      "issueID": "0e1003a2-04d2-4aef-825c-b61ce288fb81",
      "userID": "582bcbff-3b3e-4154-a7a6-3e6486930d3a"
    }
  ]
export const Comment = [
    {
      "id": "8b7b0b5e-9915-4a41-8b1f-9926ba64b919",
      "content": "I have started working on this.",
      "userID": "3ad25d9e-c8e3-47b8-8599-8664f726d49b",
      "issueID": "17f4182a-71ba-42a3-bdf6-c2962f59bc5f"
    },
    {
      "id": "703bceb2-85db-4891-bbc5-67d19d0cab25",
      "content": "The initial implementation looks good.",
      "userID": "21952515-ce91-4d75-8665-feb5792d3c93",
      "issueID": "8af91c15-909c-4fff-ae9f-80242e8a8745"
    },
    {
      "id": "2b394ca9-ed45-44ff-9032-8e92029f7999",
      "content": "Can we review this before merging?",
      "userID": "b63a3d75-b5ea-4885-b2b3-654e7a98d40c",
      "issueID": "0e625b92-3d28-44f0-870c-24a5896e04f0"
    },
    {
      "id": "669a763d-8cd9-4999-9790-73d9f7ba09f5",
      "content": "I found a small edge case here.",
      "userID": "255ae22e-e41f-41d5-90da-d9949bb6c8fb",
      "issueID": "21da4bf1-e719-4915-8d9d-83804bbf6e2f"
    },
    {
      "id": "4d9016eb-44c6-4284-8ac9-583b08d625cc",
      "content": "This should be ready for testing soon.",
      "userID": "70662099-275e-468f-9200-45920bff4e81",
      "issueID": "5a096c5e-0287-48d4-9764-d528d91481ad"
    },
    {
      "id": "188fc3d7-1be0-414e-a954-5b8f0feb97f9",
      "content": "The API changes are complete.",
      "userID": "a11077fc-e594-4007-82e3-a80f6c86fd4f",
      "issueID": "626fe404-7a6a-485e-ad58-ffe0c9dd24e9"
    },
    {
      "id": "2aa1e3c7-fefe-4340-a6f8-0dc118790ff3",
      "content": "I will verify this on staging.",
      "userID": "697108b3-939b-42df-8408-065060a865bd",
      "issueID": "b8298f62-aea0-4fe2-ad91-92ac8ce8bc5d"
    },
    {
      "id": "ffafec0c-fcaf-4423-be19-fbfa5848abc5",
      "content": "Looks good from my side.",
      "userID": "23624c89-d6b1-49e9-a612-2b71fcd95db5",
      "issueID": "ff6b77e3-ab4c-4e34-9382-658bc5eff172"
    },
    {
      "id": "01a411fd-51d6-4bb0-8b42-f6ef833c9429",
      "content": "I have added the requested changes.",
      "userID": "582bcbff-3b3e-4154-a7a6-3e6486930d3a",
      "issueID": "4620e312-1689-4be5-a8f7-c8e35da594b3"
    },
    {
      "id": "0f03eb5b-825e-4479-a72e-55cc416ea34b",
      "content": "Let's discuss this in the next review.",
      "userID": "b0910ee7-437a-4ed7-9f70-fe68cf0f5734",
      "issueID": "0e1003a2-04d2-4aef-825c-b61ce288fb81"
    }
  ]