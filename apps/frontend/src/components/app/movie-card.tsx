import { Movie as APIMovie } from "@repo/api/v1";
import { AspectRatio } from "../ui/aspect-ratio";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Separator } from "../ui/separator";

function Score({
  score,
  classNames,
}: {
  score?: string;
  classNames: React.HTMLAttributes<HTMLDivElement>["className"];
}) {
  return (
    <div
      className={`flex items-center gap-1 bg-white/60 p-2 rounded-xl w-fit ${classNames}`}
    >
      <span className="text-xs font-bold text-gray-800">{score}/10</span>
    </div>
  );
}

function MovieCard({ movie }: { movie: APIMovie }) {
  return (
    <Card className="flex flex-col h-full max-w-sm overflow-hidden shadow-md hover:shadow-lg transition duration-50">
      <CardHeader className="relative p-3 pb-0">
        <AspectRatio ratio={5 / 3}>
          <img
            src={movie.image}
            alt="Image missing"
            className="object-cover w-full h-full rounded-t-md"
          />
          <CardTitle className="absolute bottom-0 m-0 p-2 text-left backdrop-blur-sm bg-white/55 w-full">
            {movie.title}
          </CardTitle>
          {movie.popularity != undefined && (
            <Score
              score={movie.popularity.toFixed(1)}
              classNames="absolute top-0 right-0 m-1 mt-2"
            />
          )}
        </AspectRatio>
      </CardHeader>
      <Separator />
      <CardContent className="p-3">
        <p className="line-clamp-5 text-justify">{movie.overview}</p>
      </CardContent>
      <CardFooter className="p-3 mt-auto block">
        <p className="text-left"> released: {movie.releaseDate} </p>
      </CardFooter>
    </Card>
  );
}

export default MovieCard;
