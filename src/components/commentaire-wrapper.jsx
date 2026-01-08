import React, { useState, useEffect, useRef } from "react";
import supabase from "@/utils/supabase";
import { useAuth } from "@/context/authContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";

export const CommentaireWrapper = ({ resourceId, children }) => {
	const { user } = useAuth();
	const [selection, setSelection] = useState(null);
	const [comments, setComments] = useState([]);
	const [newComment, setNewComment] = useState("");
	const [showPopup, setShowPopup] = useState(false);
	const [popupPosition, setPopupPosition] = useState({ x: 0, y: 0 });
	const containerRef = useRef(null);
	const contentRef = useRef(null);

	useEffect(() => {
		if (resourceId) {
			fetchCommentaries();
		}
	}, [resourceId]);

	const fetchCommentaries = async () => {
		const { data, error } = await supabase
			.from("commentaire")
			.select("*")
			.eq("id_ressource", resourceId)
			.order("created_at", { ascending: false });
		if (error) {
			console.error("Error fetching commentaries:", error);
		} else {
			setComments(data);
		}
	};

	const handleMouseUp = () => {
		const selectionObj = window.getSelection();
		const text = selectionObj.toString().trim();

		if (text.length > 0) {
			const range = selectionObj.getRangeAt(0);
			//Used to prevent the popup from appearing when the user selects text outside the content area. range.common
			if (
				contentRef.current &&
				!contentRef.current.contains(range.commonAncestorContainer)
			) {
				setShowPopup(false);
				return;
			}

			const rect = range.getBoundingClientRect();

			if (containerRef.current) {
				const containerRect = containerRef.current.getBoundingClientRect();
				// Calculate position relative to container
				setPopupPosition({
					top: rect.bottom - containerRect.top + 5, // 5px offset below text
					left: rect.left - containerRect.left,
				});
			}
			setSelection({
				text: text,
				start: range.startOffset,
				end: range.endOffset,
			});
			setShowPopup(true);
		} else {
			// Don't close if clicking inside the popup (handled by event bubbling/outside click check usually, but for now simple toggle logic)
			// Keeping existing logic: selection clears popup unless we add specific checks.
			// Ideally we want to keep popup open if interacting with it.
			// For this refactor, keeping closest to original logic but we might need to handle onMouseDown on popup to prevent close.
		}
	};

	const saveComment = async () => {
		if (!user) {
			console.warn("User not logged in");
			return;
		}
		const { data, error } = await supabase.from("commentaire").insert([
			{
				id_ressource: resourceId,
				id_user: user.id,
				contenu: newComment,
				selection: selection ? selection.text : null,
			},
		]);

		if (error) {
			console.error("Error saving comment:", error);
		} else {
			setNewComment("");
			setShowPopup(false);
			setSelection(null);
			fetchCommentaries();
		}
	};

	return (
		<div className="relative p-6" ref={containerRef}>
			<div className="mb-8" onMouseUp={handleMouseUp} ref={contentRef}>
				{children}
			</div>

			{/* Comment Popup */}
			{showPopup && (
				<Card
					style={{
						position: "absolute",
						top: popupPosition.top,
						left: popupPosition.left,
						zIndex: 50,
					}}
					className="w-72 shadow-xl py-0"
					onMouseDown={(e) => e.stopPropagation()} // Prevent clearing selection when clicking in popup
				>
					<CardContent className="p-3 flex flex-col gap-3">
						<div className="text-xs text-muted-foreground border-l-2 border-primary pl-2 italic wrap-anywhere">
							"{selection?.text}"
						</div>
						<Textarea
							className="min-h-[80px] resize-none"
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder="Add a comment..."
						/>
						<div className="flex justify-end gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setShowPopup(false)}
								className={"hover:text-red-500"}
							>
								Cancel
							</Button>
							<Button
								size="sm"
								onClick={saveComment}
								className={"hover:text-green-500"}
							>
								Save
							</Button>
						</div>
					</CardContent>
				</Card>
			)}

			{/* Comments List */}
			<div className="mt-8">
				<h3 className="font-bold text-lg mb-4">Comments ({comments.length})</h3>
				<ScrollArea className="h-[500px] w-full pr-4">
					<div className="space-y-4">
						{comments.map((c) => (
							<Card key={c.id} className="bg-muted/30 py-0">
								<CardContent className="p-4 space-y-3">
									{c.selection && (
										<div className="text-xs text-muted-foreground border-l-2 border-primary pl-2 italic">
											"{c.selection}"
										</div>
									)}
									<p className="text-sm">{c.contenu || c.texte}</p>
									<div className="flex items-center gap-2 text-xs text-muted-foreground">
										<span>{new Date(c.created_at).toLocaleString()}</span>
									</div>
								</CardContent>
							</Card>
						))}
					</div>
				</ScrollArea>
			</div>
		</div>
	);
};
