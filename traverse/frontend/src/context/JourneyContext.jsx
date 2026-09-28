import { createContext, useContext, useState, useEffect } from 'react'

const JourneyContext = createContext()

export const journeyDefaults = {
    leg1: {
        key: 'cab', label: 'Cab',
        desc: 'JUIT → Waknaghat Bus Stand',
        price: 300
    },
    leg2: {
        key: 'bus', label: 'Bus',
        desc: 'Waknaghat → Chandigarh Railway Station',
        price: 300
    },
    leg3: {
        key: 'train', label: 'Intercity Train',
        desc: 'Chandigarh → New Delhi',
        price: 400
    },
    leg4: {
        key: 'cab', label: 'Cab',
        desc: 'New Delhi Station → Destination',
        price: 300
    },
}

export const legOptions = {
    leg1: [
        {
            key: 'cab', label: 'Cab', price: 300,
            desc: 'JUIT → Waknaghat Bus Stand'
        },
        {
            key: 'walk', label: 'Walk (4km)', price: 0,
            desc: 'JUIT → Waknaghat Bus Stand'
        },
    ],
    leg2: [
        {
            key: 'bus', label: 'Bus', price: 300,
            desc: 'Waknaghat → Chandigarh Railway Station'
        },
        {
            key: 'cab', label: 'Direct Cab', price: 3000,
            desc: 'JUIT → Chandigarh Railway Station'
        },
    ],
    leg3: [
        {
            key: 'train', label: 'Intercity Train', price: 400,
            desc: 'Chandigarh → New Delhi'
        },
        {
            key: 'shatabdi', label: 'Shatabdi Express', price: 800,
            desc: 'Chandigarh → New Delhi'
        },
        {
            key: 'vande', label: 'Vande Bharat', price: 1200,
            desc: 'Chandigarh → New Delhi'
        },
        {
            key: 'flight', label: 'Flight', price: 4500,
            desc: 'Chandigarh Airport → Delhi Airport'
        },
    ],
    leg4: [
        {
            key: 'cab', label: 'Cab', price: 300,
            desc: 'New Delhi Station → Destination'
        },
        {
            key: 'metro', label: 'Metro', price: 50,
            desc: 'New Delhi Station → Destination'
        },
        {
            key: 'airportcab', label: 'Airport Cab', price: 500,
            desc: 'Delhi Airport → Destination'
        },
    ],
}

export function JourneyProvider({ children }) {
    const [journey, setJourney] = useState(() => {
        try {
            const saved = localStorage.getItem('traverse_journey')
            return saved ? JSON.parse(saved) : journeyDefaults
        } catch {
            return journeyDefaults
        }
    })

    useEffect(() => {
        localStorage.setItem('traverse_journey',
            JSON.stringify(journey))
    }, [journey])

    const updateLeg = (legKey, option) => {
        setJourney(prev => ({
            ...prev,
            [legKey]: option
        }))
    }

    const totalCost = Object.values(journey)
        .reduce((sum, leg) => sum + leg.price, 0)

    const resetJourney = () => {
        setJourney(journeyDefaults)
        localStorage.removeItem('traverse_journey')
    }

    return (
        <JourneyContext.Provider value={{
            journey, updateLeg, totalCost, resetJourney
        }}>
            {children}
        </JourneyContext.Provider>
    )
}

export function useJourney() {
    return useContext(JourneyContext)
}