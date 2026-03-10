import { useEffect, useRef, useState } from 'react';
import { setOptions, importLibrary } from '@googlemaps/js-api-loader';

interface AddressComponents {
  streetAddress: string;
  suburb: string;
  state: string;
  postcode: string;
}

interface UseGooglePlacesAutocompleteOptions {
  onPlaceSelected: (address: AddressComponents) => void;
}

let optionsConfigured = false;

function parseAddressComponents(
  components: google.maps.GeocoderAddressComponent[]
): AddressComponents {
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

/**
 * Hook that provides Google Places address autocomplete using the classic
 * google.maps.places.Autocomplete widget.
 *
 * Returns an `inputRef` to attach to an <input> element. When the Places API
 * loads, the Autocomplete widget binds to that input. If the API key is missing
 * or the script fails to load, the input remains a plain text field.
 */
export function useGooglePlacesAutocomplete({ onPlaceSelected }: UseGooglePlacesAutocompleteOptions) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
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

    (async () => {
      try {
        if (!optionsConfigured) {
          setOptions({ key: apiKey });
          optionsConfigured = true;
        }

        await importLibrary('places');

        if (cancelled || !inputRef.current) return;

        const autocomplete = new google.maps.places.Autocomplete(inputRef.current, {
          types: ['geocode'],
          componentRestrictions: { country: 'au' },
          fields: ['address_components'],
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (!place.address_components) return;

          const parsed = parseAddressComponents(place.address_components);
          onPlaceSelectedRef.current(parsed);
        });

        autocompleteRef.current = autocomplete;
        setIsLoaded(true);
      } catch (err) {
        console.warn(
          '[useGooglePlacesAutocomplete] Failed to load Google Places library:',
          err instanceof Error ? err.message : err
        );
      }
    })();

    return () => {
      cancelled = true;
      if (autocompleteRef.current) {
        google.maps.event.clearInstanceListeners(autocompleteRef.current);
        autocompleteRef.current = null;
      }
    };
  }, []);

  return { inputRef, isLoaded };
}
