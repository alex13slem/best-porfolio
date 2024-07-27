CREATE OR REPLACE FUNCTION update_technologies_to_projects(
	p_project_id INTEGER,
	p_technology_ids INTEGER[]
)
RETURNS VOID AS $$
BEGIN
	-- Удалить старые связи, которые не присутствуют в новом списке
	DELETE FROM technologies_to_projects
	WHERE project_id = p_project_id
	AND technology_id <> ALL(p_technology_ids);

	-- Вставить новые связи
	INSERT INTO technologies_to_projects (project_id, technology_id)
	SELECT p_project_id, unnest(p_technology_ids)
	ON CONFLICT (project_id, technology_id) DO NOTHING;
END;
$$ LANGUAGE plpgsql;