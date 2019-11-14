export const dashboardDocuments = [
	{
		date: 1299904593000,
		user: {
			name: 'John May',
			did: 'did:selfkey:21174817792123'
		},
		type: 'Notarization',
		noOfDocs: 2,
		status: 'pending'
	},
	{
		date: 1569504593,
		user: {
			name: 'John June',
			did: 'did:selfkey:31044817792177'
		},
		type: 'Identity Validation',
		noOfDocs: 10,
		status: 'pending'
	},
	{
		date: 1169504593,
		user: {
			name: 'John July',
			did: 'did:selfkey:591374814712873'
		},
		type: 'Notarization',
		noOfDocs: 5,
		status: 'pending'
	},
	{
		date: 1569504593,
		user: {
			name: 'John June',
			did: 'did:selfkey:31044817792177'
		},
		type: 'identity Validation',
		noOfDocs: 10,
		status: 'pending'
	},
	{
		date: 1169504593,
		user: {
			name: 'John July',
			did: 'did:selfkey:591374814712873'
		},
		type: 'notarization',
		noOfDocs: 5,
		status: 'pending'
	}
];

export const history = [
	{
		date: 1299904593000,
		user: {
			name: 'John May',
			did: 'did:selfkey:21174817792123'
		},
		revenue: {
			usd: '120',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 2
	},
	{
		date: 1569504593,
		user: {
			name: 'John June',
			did: 'did:selfkey:31044817792177'
		},
		revenue: {
			usd: '123',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 10
	},
	{
		date: 1169504593,
		user: {
			name: 'John July',
			did: 'did:selfkey:591374814712873'
		},
		revenue: {
			usd: '123',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 5
	},
	{
		date: 1569504593,
		user: {
			name: 'John June',
			did: 'did:selfkey:31044817792177'
		},
		revenue: {
			usd: '123',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 10
	},
	{
		date: 1169504593,
		user: {
			name: 'John July',
			did: 'did:selfkey:72td8w217692y3did:selfkey:72td8w217692y3'
		},
		revenue: {
			usd: '123',
			key: '293.920.291'
		},
		rate: '0,003229',
		noOfDocs: 5
	}
];

export const individualDocuments = {
	did: '0x77758bd1ac2290a6995f3ed2c3616131e4be4d03da10d241ec9ea0dd0f327a52',
	firstName: 'John',
	lastName: 'Doe',
	documents: [
		{
			createdAt: 1573128613248,
			data: {
				value: {
					expires: '2019-11-15'
				},
				image: '$document-1',
				issued: '2019-11-21',
				selfie: {
					image: '$document-2'
				}
			},
			documents: [
				{
					attributeId: 7,
					content:
						'data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/hC2ZodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1MzYxMywgMjAxMy8wNy8xMS0wNToyMTo1NCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6bnMxPSJodHRwOi8vd3d3LmRheS5jb20vZGFtLzEuMCIgeG1sbnM6ZGM9Imh0dHA6Ly9wdXJsLm9yZy9kYy9lbGVtZW50cy8xLjEvIiBuczE6UGh5c2ljYWxoZWlnaHRpbmluY2hlcz0iLTEuMCIgbnMxOlBoeXNpY2Fsd2lkdGhpbmluY2hlcz0iLTEuMCIgbnMxOkZpbGVmb3JtYXQ9IkpQRUciIG5zMTpQcm9ncmVzc2l2ZT0ibm8iIG5zMTpleHRyYWN0ZWQ9IjIwMTctMDctMDdUMTY6MDU6MzIuODYzKzAyOjAwIiBuczE6Qml0c3BlcnBpeGVsPSIyNCIgbnMxOk1JTUV0eXBlPSJpbWFnZS9qcGVnIiBuczE6UGh5c2ljYWx3aWR0aGluZHBpPSItMSIgbnMxOlBoeXNpY2FsaGVpZ2h0aW5kcGk9Ii0xIiBuczE6TnVtYmVyb2ZpbWFnZXM9IjEiIG5zMTpOdW1iZXJvZnRleHR1YWxjb21tZW50cz0iMCIgbnMxOnNoYTE9ImQ1ZjMxNzEyYTdkMjI4NTRlNjAxNDJkM2JkYTZhYmY0ZjViMzc0NDUiIG5zMTpzaXplPSI5MTE1IiBkYzpmb3JtYXQ9ImltYWdlL2pwZWciIGRjOm1vZGlmaWVkPSIyMDE3LTA5LTAxVDExOjExOjUzLjA3MiswMjowMCIvPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDw/eHBhY2tldCBlbmQ9InciPz7/7QAsUGhvdG9zaG9wIDMuMAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/+wAEUR1Y2t5AAEABAAAAFAAAP/uAA5BZG9iZQBkwAAAAAH/2wCEAAICAgICAgICAgIDAgICAwQDAgIDBAUEBAQEBAUGBQUFBQUFBgYHBwgHBwYJCQoKCQkMDAwMDAwMDAwMDAwMDAwBAwMDBQQFCQYGCQ0LCQsNDw4ODg4PDwwMDAwMDw8MDAwMDAwPDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDAwMDP/AABEIAMgBvgMBEQACEQEDEQH/xACOAAEAAwEBAQADAQAAAAAAAAAACAkKBwYFAQIDBAEBAQAAAAAAAAAAAAAAAAAAAAEQAAAGAQMCAwMGCQgJBQEAAAABAgMEBQYRBwghEjETCUFRFGEiMhV2OHGxQiO0tRY3GZFSYnOV1Vd3gaGCklMk1KYXcmOUVicYEQEBAQAAAAAAAAAAAAAAAAAAARH/2gAMAwEAAhEDEQA/AL/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA…lHWvOGRJKW4hEptOp+Br+GNCfepRF4mA02igAAKyPVi+7HTfbyq/QrASiiLjz+/7Y7/ADAxn9axgGxQUAGSnml96rfX7VSvxJEFsPpA/ul3W+1zP6A0EFuooAAAAAAAAAAAAAAAAAAAAAAAAAAAAxFiDTpwjw+n3B4CYHg2QNG9SZfS5RUWiE6dxMzLmzZWpBmR6KSStUn7DIjFGdfeHajKtk9xsn21zCKpi2xyWppuUSTS1MiqPujzGDPxbeb0Wn3a9p6KIyKCavD31CMi471DO3ec0snONsGXVuVLcVxKLOnN1RrdTF800tvNKUZq8pakaKMzSsi1SYWQ2fqt8ZYlSqdXwMxtrE0atUiKxhlzv06JcddlE0ktfE0qV8hGLopx5Xcu855TZJBk28RGMYRjynDxXCozpvIZU50XJkvGlHnvqItO7tSlKfmoSWqjVB7DgHx5sd8986GzmwFrwDbWVHv8wnLTqy44wvzIUDU+ilSHUF3J/wCElw/dqF8HNLYV7kNsNkmH1LSHMvpnG8gwjvMkkuxhJWXkdx6EXxDLjjJGZkRKUSj6EKMosqLNq5smFNjvV9jXPrYlxHkqaeYfZUaVoWhREpKkKIyMj6kYgub43+qq1j2OVmH8gqG0vZFSyiLC3CpSaflSGkF2o+sIrzjPctJF851tZmv2t92qlNHfM/8AVm2LpaeQrb/GMkzbIVtn8DGlsN1cBK9OnnvrccdIiP2IaVr7y8Q0UX7ybw5vvrn9xuNn9gmbeWppbZjspNEWFFa18mJFbM1djTZGehamZmZqUalKUowtd9KHjzYlZXnIrJIC41ciK/Q7dE8nQ5DjqiTYTm9SI+1tKfISouijU6X5IQRs9Uz71c77LU34nQHYPSA/elu59lYv6ckILIvUU+5tvL/V0X6+rhRliEG2mfBh2kGbWWEdEuBYsORZ0VwtUOsvJNDiFF7lJMyMUZBeReyt5sBu7lu29yy78LWylSMYsnC0KfUvqUqHJSrQiM1ILtXp9FxK0+KRBMHhBz3Vx3rnNtNyK2bf7XSJTkuom15JcnUr759zxIacUhLsdxfz1IJRKSo1KT3Go0gLbf4iXD36r+tP/Lzfb2d3wH1RcfFd2n0PK+C1116a/R+XTqKK2OUfqhZDm8Z/DuPjNjgtEtZfWGeyjSzcyiQevZEbbUsorZmXVfcbii6fm/nEqCd/B3m7Vci6drBs4dYqN5qKL3ymUkTUe8jMkRKmRUloSXUl1eaLw+mj5mqW6Pt+obx6sN99jnJeLwVT8721kLvcdhNJ7npkY2+yfCbItTNTjZJcSki1UttCS+kAzHVdnZ0NpX3NRNfq7inlNTKywjrNp+PJjrJxp1tZaGlSFpIyMvAyEF5exvqzYq5QQKbfzF7OHksJpLL2YY6y1IiTjQWnnPxFONLYWr8omu9JnqZEgvmk0eo3U9Wva6pp5UfaHDrnLsmdQpMOdetIrqthRlolxaUOuSHu0+poJLev/EINEDtgPUR3c293bucv3Nup2fYZn01D2bUClFrEMiJtEmqaMybYUw2RJ8pOiHEESVaKJK0hYb6nGUUWbcPsIy/GLBFrjuS5dR2VLYoSpJPRpFfPcbX2rJKk6pPqSiIy8DLUBSDx5/f9sb/mBjP61jANigoAMlPNL71W+v2qlfiSILYfSB/dLut9rmf0BoILdRQAAAAAAAAAAAAAAAAAAAAAAAAAAABlh/h2cyP8Gnf7cof7xEF/fC7bzMdqeM+2WA5/THj+XY+i2K3qDfYkmycm3myWvzsZx1pXc06hXzVnprofXUhR/LlDxJ245Q46xEyQl4/mVM2tGLZ3CbSuVFJRmryXmzNJSGDV1NtSiMj1NCkGZmYULbrenhye2ynSShYO7uRRIUfwl9iRnPN1Ps7oJEUtCtPEvKNOvQlK8RBH+Nx23/mSygxdj8+elmrtOOWN2fck/wClrH+bp7TMBMzY/wBL/fTcGfDn7nNNbSYh3JXKOYtuVcPt+1LEJlaibM/DV9aDT49i/ABfttDs9gWxuEVuAbdUyaijgauPurPzJU2SsiJyVLe0I3HXO0tT0IiIiSkkoSlJUdPAVv8ALz09MR5ATpuf4DYRsC3UkJ7rF51tR1VytJaJVMS0Rrae6EXnNpUZl9NCz0UkKUs+4T8otu5j8a32cv7mO0oybtccjqu4riC8HCXA85SCP/3EpP3kQg8XQ8YuRWTS0QqfY7OH3XFdvmvUc2Mwk/D58iQ020j/AGlEAsk44elTkk2yr8n5GzmKSljLS9/44qZKX5so0nr5c2awZtMtn4KJha1KLUiW2fUBeXTU1Tj1TW0NFXR6ilp4zcOqq4jaWWI8dlJIbaabQRElKUkRERCiknn5xE5Ebz8gZWa7abdLybGHKCshItE2dVEI345OeYjy5cxlz5vcXXt09wg6T6bnGLfLYjPtxbndfBV4nWXmPx4VVJVYV0zzX0SkuKR2wpT6k6JLXVREQCbnNHbzMd1uM+5uA4BTHkGXZAipKoqCfYjG8ca3hSXfzslxppPa00tXzllrpoXXQhRQJ/Ds5kf4NO/25Q/3iINTwojPyZ4sbd8n8TZpMtQuoyOnJxeJ5tDQlUyvccIu5JpUZE8wsyLvaUZa6apUhWiiCg/dj06OTm2c6V9V4arczH21K+EvcUV8W44j8nvgH2y0L08SJtSSPoS1eIgjknj3v4uT8EnY/P1TNe34UsatPM11007fhtfEBJPar04uTu5MyKq2xFO2VA4pPxN3lLhR3UI/K7IDZrlKVp4EpCEmfQ1EAvV4w8QtsuL9K8nG215Dm1sylrI8+sG0plyEkZKNiO2k1Jjsdxa+WkzM+netZpSZUStAVV8tvTXoN3ba03G2bnwsIz2yWuTe45LSpFPaSFH3LfSppKlRX1nqajJCkLV1NKFGpZwU65rw55PYFMeh3myeUS0tKMvj6SCu5iKLXoon674hBEfs7jI/eWoD4+M8VeSWXy2odHsdmbi3jJKZM2ok18YjPw7pU1DDKf8ASsgFo/GP0sHayzrcz5HzYc5MJaJEPbCsd89lxxJkZFZy06JWkj8WmdUq6auGnVBsEvfUE2Wz/ePYKlwTaTFE39zXZVWzUUjEiHAQ1BixJjJmhUp2O0SUG4hJJJWvXoWhCipzZrgVyzxXeDanJ77aVyBRY5mNFaXU47mkc8iJDsGH33Oxqetau1CDPRKTM/YRmINKooAM7PJ/g7yl3B5A7sZrh+1jlxjGSZBIm0toVvTME+wsk9q/LfnNuJ108FJIxBYX6b2xe6uxG3e4VHuviisTtLvI2p1XFVMhTPNjpiNtGvuhPvpT85JlooyP5AFjYoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKi/Vittw8TxrZnLsKy6+xSuZs7eovXKawkwUvPTGYz8Qnvh3EdxpTFf7e7w1PT2iUVncW+T2d4VyB2uyHcHdDJ7XCmbf4PJI1tczZUJEWwZdhKkPtPPKQpLHnk71I9O3UupEA1RoWhxCHG1k424RKQtJ6koj6kZGXiRij9gFLvqr7+W2MWW2e2OA5naY9kcRMu+y1yknvwnWmHkoYgsvLjOIM+/R1farwIkK0+cQlEKeEuebzbhcotosembnZhcVSbVyyuYEu7nvxlxK6M7LcS+248pCkq8ok6KLQzMi9oDTwKAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAADgfJrZCv5C7M5dtpKdbh2VgymZi9o6RmmJaxD8yK6rQjMkKVq25oWvlrVp1AZKsvxHJMCye7w3L6h+iyXHZa4VvVSU9rjTrZ/yKSotFJURmlSTJSTMjIxBPfjp6k+7eyGP1+E5NTRt1MMp20sUkafKXCs4TCC0RHanJbfJTSC6JS40s0lolKkpIkkHdtwPV8y+0p5EDbbaSBiNvIbNCMguLJVt5BqLTuaitxoiDUnxSa1qTr4oMuhtFR+V5Xkec5HcZdl1zKyDJL+SqXb3Exfe8+6r2mfgRERESUkREkiJKSIiIgF7vpdcYbTBKGz37zatXAvc4gpgYJWyEGl5imWtLrsxaVFqk5a0I8voR+Wnu6pdAW7igAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIlcmeG20/JyC3KyNh3G86gMeRT59VoR8WhstTSzKbVoiSyRnqSVGSk9exaNT1Cm7PvSs5KY1NfThq8f3IrO4/hJEOe3WylI9nmsWBstoUfuS8sv6QmDxdD6ZvLy4mIjWGCVmKsrMiVYWl7WOMpI/aZV78xzQvkQYCyTjh6XeBba2Vfl+8lwxufk0BaX4ONMMqboYzyT1JTqXfzkw0mWpeYlCP5zauhgLVUpJJElJElKS0SkuhERewhR+QAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAH//Z',
					createdAt: 1573128613289,
					env: 'development',
					id: 1,
					identityId: 1,
					mimeType: 'image/jpeg',
					name: 'logo-logitech.jpg',
					size: 12081,
					type: {
						content: {
							$id: 'http://platform.selfkey.org/schema/attribute/passport.json',
							$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
							description:
								'Please provide an image of your passport. It must still be valid.',
							entityType: ['individual'],
							identityAttribute: true,
							identityAttributeRepository:
								'http://platform.selfkey.org/repository.json',
							required: (4)[('image', 'issued', 'expires', 'selfie')],
							title: 'Passport',
							type: 'object'
						},
						createdAt: 1573118719903,
						defaultRepositoryId: 2,
						env: 'development',
						expires: 1573543675337,
						id: 15,
						updatedAt: 1573457275344,
						url: 'http://platform.selfkey.org/schema/attribute/passport.json'
					},
					updatedAt: 157312861332
				},
				{
					attributeId: 7,
					createdAt: 1573128613289,
					env: 'development',
					id: 2,
					identityId: 1,
					mimeType: 'image/jpeg',
					name: 'logo-logitech.jpg',
					size: 12081,
					updatedAt: 1573128613321
				}
			],
			env: 'development',
			id: 7,
			identityId: 1,
			isValid: true,
			name: 'pp',
			type: {
				content: {
					$id: 'http://platform.selfkey.org/schema/attribute/passport.json',
					$schema: 'http://platform.selfkey.org/schema/identity-attribute.json',
					description:
						'Please provide an image of your passport. It must still be valid.',
					entityType: ['individual'],
					identityAttribute: true,
					identityAttributeRepository: 'http://platform.selfkey.org/repository.json',
					required: (4)[('image', 'issued', 'expires', 'selfie')],
					title: 'Passport',
					type: 'object'
				},
				createdAt: 1573118719903,
				defaultRepositoryId: 2,
				env: 'development',
				expires: 1573543675337,
				id: 15,
				updatedAt: 1573457275344,
				url: 'http://platform.selfkey.org/schema/attribute/passport.json'
			},
			typeId: 15,
			updatedAt: 1573128613321
		}
	]
};

export const item = {
	applicationDate: '2019-11-07T12:10:37.655Z',
	createdAt: 1573128638021,
	currentStatus: 9,
	currentStatusName: 'In Progress',
	id: '5dc409bd39ba9cb7b55e6f89',
	identityId: '1',
	nextRoute: null,
	owner: null,
	payments: {
		amount: 0.25,
		amountKey: '118.19742389097111764263',
		date: 1573133063725,
		status: 'Sent KEY',
		transactionHash: '0xb44e698e2afa54f3a8600547300bcb734254fa357664fd5e02bf9bd371abff38'
	},
	rpName: 'flagtheory_certif',
	scope: null,
	sub_title: null,
	updatedAt: 1573205235431,
	walletId: null
};

// export const messagesReply = [
// 	{
// 		id: 809598767582156,
// 		name: 'John Paul',
// 		type: 'person',
// 		date: 1569504593,
// 		message:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.'
// 	},
// 	{
// 		id: 2348767582156,
// 		name: 'Smith Jhonson Certifier',
// 		type: 'certifier',
// 		date: 2234104593,
// 		message:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.  '
// 	},
// 	{
// 		id: 2348767582156,
// 		name: 'Smith Jhonson Certifier',
// 		type: 'certifier',
// 		date: 2234104593,
// 		message:
// 			'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam dictum ullamcorper purus sit amet convallis. Quisque congue augue quam, dignissim aliquam lorem dignissim ac.  '
// 	}
// ];

// export const messages = [
// 	{
// 		date: 1299904593000,
// 		user: {
// 			name: 'John May',
// 			did: 'did:selfkey:21174817792123'
// 		},
// 		message: ' I need my ID card authenticated. help!',
// 		noOfDocs: 2,
// 		status: 'pending'
// 	},
// 	{
// 		date: 1569504593,
// 		user: {
// 			name: 'John June',
// 			did: 'did:selfkey:31044817792177'
// 		},
// 		message: 'Can you please provide more informations on what is exactly you…',
// 		noOfDocs: 10,
// 		status: 'pending'
// 	},
// 	{
// 		date: 1169504593,
// 		user: {
// 			name: 'John July',
// 			did: 'did:selfkey:591374814712873'
// 		},
// 		message: 'Need Certified True Copy of these',
// 		noOfDocs: 5,
// 		status: 'pending'
// 	},
// 	{
// 		date: 1569504593,
// 		user: {
// 			name: 'John June',
// 			did: 'did:selfkey:31044817792177'
// 		},
// 		message: 'Hi',
// 		noOfDocs: 10,
// 		status: 'pending'
// 	},
// 	{
// 		date: 1169504593,
// 		user: {
// 			name: 'John July',
// 			did: 'did:selfkey:72td8w217692y3did:selfkey:72td8w217692y3'
// 		},
// 		message:
// 			'Sure I can do a call on Nov 21st. I will have to install zoom but, I will have to install zoom but.',
// 		noOfDocs: 5,
// 		status: 'pending'
// 	}
// ];
