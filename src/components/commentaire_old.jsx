import React, { use, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router";
import supabase from "@/utils/supabase";

export default function Commentaire(children, id_ressource) {
	const { user } = useAuth();
	const [selection, setSelection] = useState(null);
	const [comment, setComment] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });

	useEffect(() => {
		fetchCommentaries();
	}, []);

	const fetchCommentaries = async () => {
		const { data, error } = await supabase
			.from("commentaire")
			.select("*")
			.eq("id_ressource", id_ressource)
			.order("created_at", { ascending: false });
		if (error) {
			console.error("Error fetching commentaries:", error);
		} else {
			setComment(data);
		}
	};

	const handleMouseUp = () => {
		const selection = window.getSelection();
		const text = selection.toString().trim();
		if (text.length > 0) {
			const range = selection.getRangeAt(0);
			const rect = range.getBoundingClientRect();
			setPopupPosition({
				top: rect.bottom + window.scroll + 10,
				left: rect.left + window.scrollX,
			});
			setSelection({
				text: text,
				start: range.startOffset,
				end: range.endOffset,
				startContainer: range.startContainer,
				endContainer: range.endContainer,
			});
			setShowPopup(true);
		}
	};

	const saveComment = async () => {
		if (!user) {
			return <Navigate to="/login" />;
		}
		const { data, error } = await supabase.from("commentaire").insert([
			{
				id_ressource: id_ressource,
				id_user: user.id,
				texte: newComment,
				selection: selection ? selection.text : null,
			},
		]);
	};
}
