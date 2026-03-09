import { useEffect, useRef, useCallback, useState } from 'react';

interface AddressComponents {
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
}

interface UseGooglePlacesAutocompleteOptions {
  onPlaceSelected: (address: AddressComponents) => void;
}

const SCRIPT_ID = 'google-places-script';

function loadGooglePlacesScript(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps?.places) {
      resolve();
      return;
    }

    const existing = document.getElementById(SCRIPT_ID);
    if (existing) {
      // Script is already loading — wait for it
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google Places script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Places script failed to load'));
    document.head.appendChild(script);
  });
}

function parseAddressComponents(place: google.maps.places.PlaceResult): AddressComponents {
  const components = place.address_components || [];
  let streetNumber = '';
  let route = '';
  let suburb = '';
  let state = '';
  let postcode = '';

  for (const component of components) {
    const types = component.types;
    if (types.includes('street_number')) {
      streetNumber = component.long_name;
    } else if (types.includes('route')) {
      route = component.long_name;
    } else if (types.includes('locality')) {
      suburb = component.long_name;
    } else if (types.includes('administrative_area_level_1')) {
      state = component.short_name;
    } else if (types.includes('postal_code')) {
      postcode = component.long_name;
    }
  }

  const streetAddress = streetNumber ? `${streetNumber} ${route}` : route;

  return { streetAddress, suburb, state, postcode };
}

export function useGooglePlacesAutocomplete({ onPlaceSelected }: UseGooglePlacesAutocompleteOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  onPlaceSelectedRef.current = onPlaceSelected;

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) return;

    let cancelled = false;

    loadGooglePlacesScript(apiKey)
      .then(() => {
        if (cancelled) return;
        setIsLoaded(true);
      })
      .catch(() => {
        // Silently fail — fields remain as regular text inputs
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const initAutocomplete = useCallback(() => {
    if (!isLoaded || !inputRef.current || autocompleteRef.current) return;

    const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
      types: ['address'],
      componentRestrictions: { country: 'au' },
      fields: ['address_components'],
    });

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (place.address_components) {
        const parsed = parseAddressComponents(place);
        onPlaceSelectedRef.current(parsed);
      }
    });

    autocompleteRef.current = autocomplete;
  }, [isLoaded]);

  useEffect(() => {
    initAutocomplete();
  }, [initAutocomplete]);

  return { inputRef, isLoaded };
}
