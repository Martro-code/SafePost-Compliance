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
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('Google Places script failed to load')));
      return;
    }

    const script = document.createElement('script');
    script.id = SCRIPT_ID;
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Google Places script failed to load'));
    document.head.appendChild(script);
  });
}

function parseAddressComponents(place: google.maps.places.Place): AddressComponents {
  const components = place.addressComponents || [];
  let streetNumber = '';
  let route = '';
  let suburb = '';
  let state = '';
  let postcode = '';

  for (const component of components) {
    const types = component.types;
    if (types.includes('street_number')) {
      streetNumber = component.longText || '';
    } else if (types.includes('route')) {
      route = component.longText || '';
    } else if (types.includes('locality')) {
      suburb = component.longText || '';
    } else if (types.includes('administrative_area_level_1')) {
      state = component.shortText || '';
    } else if (types.includes('postal_code')) {
      postcode = component.longText || '';
    }
  }

  const streetAddress = streetNumber ? `${streetNumber} ${route}` : route;

  return { streetAddress, suburb, state, postcode };
}

/**
 * Hook that provides Google Places address autocomplete using the new
 * PlaceAutocompleteElement API (replacement for the deprecated Autocomplete widget).
 *
 * Returns a `containerRef` to attach to a wrapper <div>. When the Places API loads,
 * a <gmp-place-autocomplete> element is mounted inside it. If the API key is missing
 * or the script fails to load, the container remains empty and a fallback <input>
 * should be shown by the consuming component.
 */
export function useGooglePlacesAutocomplete({ onPlaceSelected }: UseGooglePlacesAutocompleteOptions) {
  const containerRef = useRef<HTMLDivElement>(null);
  const autocompleteRef = useRef<google.maps.places.PlaceAutocompleteElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const onPlaceSelectedRef = useRef(onPlaceSelected);
  onPlaceSelectedRef.current = onPlaceSelected;

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;
    if (!apiKey) {
      console.warn(
        '[useGooglePlacesAutocomplete] VITE_GOOGLE_PLACES_API_KEY is not set in your ' +
        'environment. Set it in .env.local to enable address autocomplete.'
      );
      return;
    }

    let cancelled = false;

    loadGooglePlacesScript(apiKey)
      .then(() => {
        if (cancelled) return;
        setIsLoaded(true);
      })
      .catch((err) => {
        console.warn('[useGooglePlacesAutocomplete] Failed to load Google Places script:', err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const initAutocomplete = useCallback(() => {
    if (!isLoaded || !containerRef.current || autocompleteRef.current) return;

    const autocomplete = new google.maps.places.PlaceAutocompleteElement({
      types: ['address'],
      componentRestrictions: { country: 'au' },
    });

    autocomplete.addEventListener('gmp-placeselect', async (event: Event) => {
      const { place } = event as unknown as { place: google.maps.places.Place };
      await place.fetchFields({ fields: ['addressComponents'] });
      const parsed = parseAddressComponents(place);
      onPlaceSelectedRef.current(parsed);
    });

    // Style the inner input to match the app's form fields
    autocomplete.setAttribute('style',
      'width: 100%; --gmpx-color-surface: transparent;'
    );

    containerRef.current.appendChild(autocomplete as unknown as Node);
    autocompleteRef.current = autocomplete;
  }, [isLoaded]);

  useEffect(() => {
    initAutocomplete();

    return () => {
      if (autocompleteRef.current && containerRef.current) {
        try {
          containerRef.current.removeChild(autocompleteRef.current as unknown as Node);
        } catch {
          // Element may already have been removed
        }
      }
      autocompleteRef.current = null;
    };
  }, [initAutocomplete]);

  return { containerRef, isLoaded };
}
