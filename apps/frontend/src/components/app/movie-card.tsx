import { Movie as APIMovie } from "@repo/api/v1";
import { AspectRatio } from "../ui/aspect-ratio";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Separator } from "../ui/separator";

function MovieCard({ movie }: { movie: APIMovie }) {
  return (
    <Card className="max-w-sm overflow-hidden shadow-md hover:shadow-lg transition duration-50">
      <CardHeader className="relative p-3 pb-0">
        <AspectRatio ratio={5 / 3}>
          <img
            src="https://picsum.photos/200"
            alt="Image"
            className="object-cover w-full h-full rounded-t-md"
          />
          <CardTitle className="absolute bottom-0 m-0 p-2 text-left backdrop-blur-sm bg-white/55 w-full">
            {movie.title}
          </CardTitle>
        </AspectRatio>
      </CardHeader>
      <Separator />
      <CardContent className="p-3">
        <p className="truncate">{movie.overview}</p>
      </CardContent>
    </Card>
  );
}

export default MovieCard;
