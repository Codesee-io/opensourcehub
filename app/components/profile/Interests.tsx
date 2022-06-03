import { FC } from "react";
import { UserProfile } from "~/types";
import { getTag } from "~/utils/tags";
import Tag from "../Tag";

const Interests: FC<UserProfile> = (props) => {
  const techInterests = (props.techInterests ?? []).map((interest) =>
    getTag("techInterests", interest)
  );
  const subjectInterests = (props.subjectInterests ?? []).map((interest) =>
    getTag("subjectInterests", interest)
  );
  const roleInterests = (props.roleInterests ?? []).map((interest) =>
    getTag("roleInterests", interest)
  );

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {techInterests.length > 0 && (
        <div className="flex-1">
          <div className="text-lg text-light-type mb-2">Tech interests</div>
          <div className="flex gap-2 align-top flex-wrap">
            {techInterests.map((item) => (
              <Tag tag={item.label} key={item.id} color={item.color} />
            ))}
          </div>
        </div>
      )}
      {subjectInterests.length > 0 && (
        <div className="flex-1">
          <div className="text-lg text-light-type mb-2">
            Subject matter interests
          </div>
          <div className="flex gap-2 align-top flex-wrap">
            {subjectInterests.map((item) => (
              <Tag filled tag={item.label} key={item.id} color={item.color} />
            ))}
          </div>
        </div>
      )}
      {roleInterests.length > 0 && (
        <div className="flex-1">
          <div className="text-lg text-light-type mb-2">
            Contribution interests
          </div>
          <div className="flex gap-2 align-top flex-wrap">
            {roleInterests.map((item) => (
              <Tag filled tag={item.label} key={item.id} color={item.color} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Interests;
