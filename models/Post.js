export class Post {
  constructor(
    title,
    image,
    description,
    owner,
    likedBy,
    likeCount,
    location,
    createdAt,
    comments,
    id
  ) {
    this.title = title;
    this.image = image;
    this.address = location.address;
    this.location = { lat: location.lat, lng: location.lng };
    this.id = id;
    this.description = description;
    this.owner = owner;
    this.likeCount = likeCount;
    this.likedBy = likedBy;
    this.comments = comments;
    this.createdAt = createdAt;
  }
}
