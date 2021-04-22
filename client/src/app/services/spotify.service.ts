import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ArtistData } from '../data/artist-data';
import { AlbumData } from '../data/album-data';
import { TrackData } from '../data/track-data';
import { ResourceData } from '../data/resource-data';
import { ProfileData } from '../data/profile-data';
import { TrackFeature } from '../data/track-feature';
@Injectable({
  providedIn: 'root'
})
export class SpotifyService {
	expressBaseUrl:string = 'http://localhost:8888';

  constructor(private http:HttpClient) { }

  private sendRequestToExpress(endpoint:string):Promise<any> {
    //TODO: use the injected http Service to make a get request to the Express endpoint and return the response.
    //the http service works similarly to fetch(). It may be useful to call .toPromise() on any responses.
    //update the return to instead return a Promise with the data from the Express server
    return Promise.resolve(this.http.get(this.expressBaseUrl+endpoint).toPromise())
  }

  aboutMe():Promise<ProfileData> {
    //This line is sending a request to express, which returns a promise with some data. We're then parsing the data
    return this.sendRequestToExpress('/me').then((data) => {
      return new ProfileData(data);
    });
  }

  searchFor(category:string, resource:string):Promise<ResourceData[]>{
    //TODO: identify the search endpoint in the express webserver (routes/index.js) and send the request to express.
    //Make sure you're encoding the resource with encodeURIComponent().
    //Depending on the category (artist, track, album), return an array of that type of data.
    //JavaScript's "map" function might be useful for this, but there are other ways of building the array.

    if (category === 'artist'){
      const artists:ArtistData[] = [];
      return this.sendRequestToExpress('/search/'+category+'/'+ encodeURIComponent(resource)).then((res) => {
        console.log(res)
        res['artists']['items'].forEach(element => {
          artists.push(new ArtistData(element))
        });
        console.log(artists)
        return artists;
      });
    }

    else if (category === 'track'){
      const tracks:TrackData[] = [];
      return this.sendRequestToExpress('/search/'+category+'/'+ encodeURIComponent(resource)).then((res) => {
        console.log(res)
        res['tracks']['items'].forEach(element => {
          tracks.push(new TrackData(element))
        });
        console.log(tracks)
        return tracks;
      });
    }

    else{
      const albums:AlbumData[] = [];
      return this.sendRequestToExpress('/search/'+category+'/'+ encodeURIComponent(resource)).then((res) => {
        console.log(res)
        res['albums']['items'].forEach(element => {
          albums.push(new AlbumData(element))
        });
        console.log(albums)
        return albums;
      });
    }
  }

  getArtist(artistId:string):Promise<ArtistData> {
    //TODO: use the artist endpoint to make a request to express.
    //Again, you may need to encode the artistId.
    return this.sendRequestToExpress('/artist/' + artistId).then((artist_data)=>{
      return new ArtistData(artist_data)
    });
  }

  getRelatedArtists(artistId:string):Promise<ArtistData[]> {
    //TODO: use the related artist endpoint to make a request to express and return an array of artist data.
    const artsts = []
    return this.sendRequestToExpress('/artist-related-artists/' + artistId).then((rel_art)=>{
      rel_art['artists'].forEach(element => {
        artsts.push(new ArtistData(element))
      });
      return artsts;
    });

  }

  getTopTracksForArtist(artistId:string):Promise<TrackData[]> {
    //TODO: use the top tracks endpoint to make a request to express.
    const trks = []
    return this.sendRequestToExpress('/artist-top-tracks/' + artistId).then((top_tracks)=>{
      top_tracks['tracks'].forEach(element => {
        trks.push(new TrackData(element))
      });
      return trks;
    });
  }

  getAlbumsForArtist(artistId:string):Promise<AlbumData[]> {
    //TODO: use the albums for an artist endpoint to make a request to express.
    const albms = []
    return this.sendRequestToExpress('/artist-albums/' + artistId).then((art_albums)=>{
      art_albums['items'].forEach(element => {
        albms.push(new AlbumData(element))
      });
      return albms
    });
  }

  getAlbum(albumId:string):Promise<AlbumData> {
    //TODO: use the album endpoint to make a request to express.
    return this.sendRequestToExpress('/album/' + albumId).then((album_data)=>{
      return new AlbumData(album_data)
    });
  }

  getTracksForAlbum(albumId:string):Promise<TrackData[]> {
    //TODO: use the tracks for album endpoint to make a request to express.
    const albm_trks = []
    return this.sendRequestToExpress('/album-tracks/' + albumId).then((albmtrks)=>{
      albmtrks['items'].forEach(element => {
        albm_trks.push(new TrackData(element))
      });
      return albm_trks
    });
  }

  getTrack(trackId:string):Promise<TrackData> {
    //TODO: use the track endpoint to make a request to express.
    return this.sendRequestToExpress('/track/' + trackId).then((track_data)=>{
      return new TrackData(track_data)
    });
  }

  getAudioFeaturesForTrack(trackId:string):Promise<TrackFeature[]> {
    //TODO: use the audio features for track endpoint to make a request to express.
    const features = []
    return this.sendRequestToExpress('/track-audio-features/' + trackId).then((feature)=>{
      console.log(feature);
      TrackFeature.FeatureTypes.forEach(element => {
        features.push(new TrackFeature(element, feature[element]))
      });
      console.log(features);
      return features;
    });
  }
}
