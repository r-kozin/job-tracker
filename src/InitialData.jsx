const initialData = {
    cards: {
        'job-1': { id: 'job-1', companyName: 'Google', jobTitle: 'Web Developer' },
        'job-2': { id: 'job-2', companyName: 'Apple', jobTitle: 'Software Engineer' },
        'job-3': { id: 'job-3', companyName: 'Facebook', jobTitle: 'SWE I' },
        'job-4': { id: 'job-4', companyName: 'Netflix', jobTitle: 'Software Developer' },
    },
    columns: {
        'column-1': {
            id: 'column-1',
            title: 'Added',
            cardIds: ['job-1', 'job-2', 'job-3', 'job-4'],
        },
        'column-2': {
            id: 'column-2',
            title: 'Applied',
            cardIds: [],
        },
        'column-3': {
            id: 'column-3',
            title: 'Interviewing',
            cardIds: [],
        },
        'column-4': {
            id: 'column-4',
            title: 'Offer',
            cardIds: [],
        },
        'column-5': {
            id: 'column-5',
            title: 'Rejected',
            cardIds: [],
        },
    },
    // Facilitate reordering of the columns if adding in future
    columnOrder: ['column-1', 'column-2', 'column-3', 'column-4', 'column-5'],
}

export default initialData;