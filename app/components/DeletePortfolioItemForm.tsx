import { useSubmit } from "@remix-run/react";
import { FC } from "react";

type Props = {
  /**
   * The id of the portfolio item to delete
   */
  id: string;
};

const DeletePortfolioItemForm: FC<Props> = ({ id }) => {
  const submit = useSubmit();
  const confirmDelete = () => {
    if (!window.confirm("Are you sure you want to delete this contribution?")) {
      return;
    }

    const formData = new FormData();
    formData.set("id", id);

    submit(formData, {
      action: "/api/delete-portfolio-item",
      method: "post",
    });
  };

  return (
    <div onSubmit={confirmDelete}>
      <input type="hidden" value={id} name="id" />
      <button
        type="button"
        onClick={confirmDelete}
        className="text-brand-warm font-medium mr-auto"
      >
        Delete
      </button>
    </div>
  );
};

export default DeletePortfolioItemForm;
